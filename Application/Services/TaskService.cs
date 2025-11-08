using AutoMapper;
using Taskify.Core.DTOs;
using Taskify.Core.Entities;
using Taskify.Core.Interfaces;

namespace Taskify.Application.Services;

public class TaskService : ITaskService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public TaskService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto, int userId)
    {
        var task = _mapper.Map<TaskItem>(createTaskDto);
        task.UserId = userId;
        await _unitOfWork.Tasks.AddTaskAsync(task);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<TaskDto>(task);
    }
    public async Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId)
    {
        var task = await _unitOfWork.Tasks.GetTaskByIdAsync(taskId);
        if (task == null || task.UserId != userId)
        {
            return null;
        }
        return _mapper.Map<TaskDto>(task);
    }
    public async Task<IEnumerable<TaskDto>> GetTasksByUserIdAsync(int userId)
    {
        var tasks = await _unitOfWork.Tasks.GetTasksByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<TaskDto>>(tasks);
    }
    public async Task<bool> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId)
    {
        var task = await _unitOfWork.Tasks.GetTaskByIdAsync(taskId);
        if (task == null || task.UserId != userId)
        {
            return false;
        }
        _mapper.Map(updateTaskDto, task);
        _unitOfWork.Tasks.UpdateTask(task);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
    public async Task<bool> DeleteTaskAsync(int taskId, int userId)
    {
        var task = await _unitOfWork.Tasks.GetTaskByIdAsync(taskId);
        if (task == null || task.UserId != userId)
        {
            return false;
        }
        _unitOfWork.Tasks.DeleteTask(task);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
