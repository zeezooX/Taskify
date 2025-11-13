using AutoMapper;
using MediatR;
using Taskify.Application.Handlers.Tasks.Events;
using Taskify.Core.DTOs;
using Taskify.Core.Entities;
using Taskify.Core.Interfaces;

namespace Taskify.Application.Handlers.Tasks.Commands;

public record CreateTaskCommand(CreateTaskDto TaskDto, int UserId) : IRequest<TaskDto>;
public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, TaskDto>
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJobScheduler _jobScheduler;
    private readonly INotificationService _notificationService;
    public CreateTaskCommandHandler(
        IMapper mapper,
        IUnitOfWork unitOfWork,
        IJobScheduler jobScheduler,
        INotificationService notificationService)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _jobScheduler = jobScheduler;
        _notificationService = notificationService;
    }
    public async Task<TaskDto> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var task = _mapper.Map<TaskItem>(request.TaskDto);
        task.UserId = request.UserId;
        task.AddDomainEvent(new TaskCreatedEvent(task));
        await _unitOfWork.Tasks.AddTaskAsync(task);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _jobScheduler.Schedule(
            () => _notificationService.SendTaskCreatedNotificationAsync(task.Id, task.Title),
            TimeSpan.FromMinutes(1));

        return _mapper.Map<TaskDto>(task);
    }
}
