using AutoMapper;
using MediatR;
using Taskify.Core.DTOs;
using Taskify.Core.Interfaces;

namespace Taskify.Application.Handlers.Tasks.Queries;

public record GetTaskByIdQuery(int TaskId, int UserId) : IRequest<TaskDto?>;
public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, TaskDto?>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public GetTaskByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<TaskDto?> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetTaskByIdAsync(request.TaskId);
        if (task is null || task.UserId != request.UserId)
            return null;
        return _mapper.Map<TaskDto>(task);
    }
}
