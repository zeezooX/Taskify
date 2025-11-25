using FirebaseAdmin.Messaging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Taskify.Core.Interfaces;
using Taskify.Infrastructure.Data;

namespace Taskify.Infrastructure.Services;

public class FcmNotificationService : INotificationService
{
    private readonly AppDbContext _context;
    private readonly ILogger<FcmNotificationService> _logger;
    public FcmNotificationService(AppDbContext context, ILogger<FcmNotificationService> logger)
    {
        _context = context;
        _logger = logger;
    }
    public async Task SendTaskCreatedNotificationAsync(int taskId, string taskTitle)
    {
        var task = await _context.TaskItems
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task?.User?.FcmToken == null)
        {
            _logger.LogWarning("User has no FCM token. Cannot send notification.");
            return;
        }

        var message = new Message()
        {
            Token = task.User.FcmToken,
            Notification = new Notification
            {
                Title = "New Task Created",
                Body = $"You created: {taskTitle}"
            },
            Data = new Dictionary<string, string>()
            {
                { "taskId", taskId.ToString() },
                { "click_action", $"/tasks/{taskId}" }
            }
        };

        try
        {
            string response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
            _logger.LogInformation("Successfully sent message: " + response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending FCM message");
        }
    }
}