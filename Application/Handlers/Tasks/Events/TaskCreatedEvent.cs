using MediatR;
using Microsoft.Extensions.Logging;
using Taskify.Core.Entities;

namespace Taskify.Application.Handlers.Tasks.Events;

public record TaskCreatedEvent(TaskItem CreatedTask) : INotification;
public class TaskCreatedEventHandler : INotificationHandler<TaskCreatedEvent>
{
    private readonly ILogger<TaskCreatedEventHandler> _logger;
    public TaskCreatedEventHandler(ILogger<TaskCreatedEventHandler> logger)
    {
        _logger = logger;
    }
    public Task Handle(TaskCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("DOMAIN EVENT HANDLED: Task created with ID: {TaskId} and Title: {TaskTitle}", notification.CreatedTask.Id, notification.CreatedTask.Title);
        return Task.CompletedTask;
    }
}