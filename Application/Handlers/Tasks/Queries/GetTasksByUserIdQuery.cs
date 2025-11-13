using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Taskify.Core.DTOs;
using Taskify.Core.Interfaces;

namespace Taskify.Application.Handlers.Tasks.Queries;

public record GetTasksByUserIdQuery(int UserId, TaskQueryParameters QueryParams) : IRequest<PagedList<TaskDto>>;
public class GetTasksByUserIdQueryHandler : IRequestHandler<GetTasksByUserIdQuery, PagedList<TaskDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;
    private readonly ILogger<GetTasksByUserIdQueryHandler> _logger;
    public GetTasksByUserIdQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IDistributedCache cache,
        ILogger<GetTasksByUserIdQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _cache = cache;
        _logger = logger;
    }
    private string GenerateCacheKey(GetTasksByUserIdQuery r)
    {
        var q = r.QueryParams;
        return $"tasks:{r.UserId}:{q.PageNumber}:{q.PageSize}:{q.IsCompleted}:{q.SortBy}:{q.IsDescending}";
    }
    private sealed class CachedPagedList<T>
    {
        public List<T>? Items { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
    public async Task<PagedList<TaskDto>> Handle(GetTasksByUserIdQuery request, CancellationToken cancellationToken)
    {
        string cacheKey = GenerateCacheKey(request);
        string? cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
        if (!string.IsNullOrEmpty(cachedData))
        {
            _logger.LogInformation("CACHE HIT: Key: {CacheKey}", cacheKey);
            var cachedWrapper = JsonSerializer.Deserialize<CachedPagedList<TaskDto>>(cachedData);
            if (cachedWrapper?.Items != null)
            {
                return new PagedList<TaskDto>(
                    cachedWrapper.Items,
                    cachedWrapper.TotalCount,
                    cachedWrapper.PageNumber,
                    cachedWrapper.PageSize);
            }
        }
        _logger.LogInformation("CACHE MISS: Key: {CacheKey}", cacheKey);

        var (tasks, totalCount) = await _unitOfWork.Tasks.GetTasksByUserIdAsync(request.UserId, request.QueryParams);
        var taskDtos = _mapper.Map<List<TaskDto>>(tasks);
        var pagedList = new PagedList<TaskDto>(
            taskDtos,
            totalCount,
            request.QueryParams.PageNumber,
            request.QueryParams.PageSize);

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1),
        };

        var wrapperToCache = new CachedPagedList<TaskDto>
        {
            Items = pagedList.Items,
            TotalCount = pagedList.TotalCount,
            PageNumber = pagedList.CurrentPage,
            PageSize = pagedList.PageSize
        };

        await _cache.SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(wrapperToCache),
            options,
            cancellationToken);

        return pagedList;
    }
}
