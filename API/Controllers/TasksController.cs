using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Taskify.Core.DTOs;
using Taskify.Core.Interfaces;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    private int GetUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null)
        {
            throw new UnauthorizedAccessException("User ID claim not found.");
        }
        return int.Parse(userIdString);
    }

    [HttpGet]
    public async Task<IActionResult> GetTasksByUserId()
    {
        var tasks = await _taskService.GetTasksByUserIdAsync(GetUserId());
        return Ok(tasks);
    }

    [HttpGet("{taskId}")]
    public async Task<IActionResult> GetTaskById(int taskId)
    {
        var task = await _taskService.GetTaskByIdAsync(taskId, GetUserId());
        if (task == null)
        {
            return NotFound();
        }
        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
    {
        var createdTask = await _taskService.CreateTaskAsync(createTaskDto, GetUserId());
        return CreatedAtAction(nameof(GetTaskById), new { taskId = createdTask.Id }, createdTask);
    }

    [HttpPut("{taskId}")]
    public async Task<IActionResult> UpdateTask(int taskId, [FromBody] UpdateTaskDto updateTaskDto)
    {
        var success = await _taskService.UpdateTaskAsync(taskId, updateTaskDto, GetUserId());
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpDelete("{taskId}")]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var success = await _taskService.DeleteTaskAsync(taskId, GetUserId());
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}