namespace Taskify.Core.Interfaces;
public interface INotificationService
{
    Task SendTaskCreatedNotificationAsync(int taskId, string taskTitle);
}