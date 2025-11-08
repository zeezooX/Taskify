using Taskify.Core.DTOs;

namespace Taskify.Core.Interfaces;

public interface ITaskService
{
    Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId);
    Task<IEnumerable<TaskDto>> GetTasksByUserIdAsync(int userId);
    Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto, int userId);
    Task<bool> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId);
    Task<bool> DeleteTaskAsync(int taskId, int userId);
}