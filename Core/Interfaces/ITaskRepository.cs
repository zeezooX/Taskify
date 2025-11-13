using Taskify.Core.DTOs;
using Taskify.Core.Entities;

namespace Taskify.Core.Interfaces;

public interface ITaskRepository
{
    Task<(IEnumerable<TaskItem> Items, int totalCount)> GetTasksByUserIdAsync(int userId, TaskQueryParameters queryParameters);
    Task<TaskItem?> GetTaskByIdAsync(int taskId);
    Task<TaskItem> AddTaskAsync(TaskItem task);
    void UpdateTask(TaskItem task);
    void DeleteTask(TaskItem task);
}