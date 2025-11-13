using Microsoft.EntityFrameworkCore;
using Taskify.Core.DTOs;
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
    public async Task<(IEnumerable<TaskItem> Items, int totalCount)> GetTasksByUserIdAsync(int userId, TaskQueryParameters queryParameters)
    {
        IQueryable<TaskItem> query = _context.TaskItems.Where(t => t.UserId == userId);
        if (queryParameters.IsCompleted.HasValue)
        {
            query = query.Where(t => t.IsCompleted == queryParameters.IsCompleted.Value);
        }
        if (!string.IsNullOrWhiteSpace(queryParameters.SortBy))
        {
            query = queryParameters.SortBy.ToLowerInvariant() switch
            {
                "duedate" => queryParameters.IsDescending ? query.OrderByDescending(t => t.DueDate) : query.OrderBy(t => t.DueDate),
                "title" => queryParameters.IsDescending ? query.OrderByDescending(t => t.Title) : query.OrderBy(t => t.Title),
                _ => queryParameters.IsDescending ? query.OrderByDescending(t => t.Id) : query.OrderBy(t => t.Id),
            };
        }
        else
        {
            query = queryParameters.IsDescending ? query.OrderByDescending(t => t.Id) : query.OrderBy(t => t.Id);
        }
        int totalCount = await query.CountAsync();
        var items = await query
            .Skip((queryParameters.PageNumber - 1) * queryParameters.PageSize)
            .Take(queryParameters.PageSize)
            .ToListAsync();
        return (items, totalCount);
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