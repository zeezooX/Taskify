using Microsoft.EntityFrameworkCore;
using Taskify.Core.Entities;
using Taskify.Core.Interfaces;

namespace Taskify.Infrastructure.Data.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;
    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<TaskItem?> GetTaskByIdAsync(int taskId)
    {
        return await _context.TaskItems.FindAsync(taskId);
    }
    public async Task<IEnumerable<TaskItem>> GetTasksByUserIdAsync(int userId)
    {
        return await _context.TaskItems
            .Where(t => t.UserId == userId)
            .ToListAsync();
    }
    public async Task<TaskItem> AddTaskAsync(TaskItem task)
    {
        await _context.TaskItems.AddAsync(task);
        return task;
    }
    public void UpdateTask(TaskItem task)
    {
        _context.Entry(task).State = EntityState.Modified;
    }
    public void DeleteTask(TaskItem task)
    {
        _context.TaskItems.Remove(task);
    }
}