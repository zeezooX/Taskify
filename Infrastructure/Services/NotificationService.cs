using Microsoft.Extensions.Logging;
using Taskify.Core.Interfaces;

namespace Taskify.Infrastructure.Services;
public class NotificationService : INotificationService
{
    private readonly ILogger<NotificationService> _logger;
    public NotificationService(ILogger<NotificationService> logger)
    {
        _logger = logger;
    }
    public async Task SendTaskCreatedNotificationAsync(int taskId, string taskTitle)
    {
        // Simulate a slow email process
        await Task.Delay(2000);
        _logger.LogInformation("EMAIL SENT: Task '{Title}' (ID: {Id}) was created.", taskTitle, taskId);
    }
}