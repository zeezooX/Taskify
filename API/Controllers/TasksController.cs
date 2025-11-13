using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;
using Taskify.Application.Handlers.Tasks.Commands;
using Taskify.Application.Handlers.Tasks.Queries;
using Taskify.Core.DTOs;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[EnableRateLimiting("fixed")]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;

    public TasksController(IMediator mediator)
    {
        _mediator = mediator;
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
    public async Task<IActionResult> GetTasksByUserId([FromQuery] TaskQueryParameters queryParameters)
    {
        var pagedTasks = await _mediator.Send(new GetTasksByUserIdQuery
        (
            GetUserId(),
            queryParameters
        ));
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new
        {
            pagedTasks.TotalCount,
            pagedTasks.PageSize,
            pagedTasks.CurrentPage,
            pagedTasks.TotalPages,
            pagedTasks.HasNext,
            pagedTasks.HasPrevious
        }));
        return Ok(pagedTasks.Items);
    }

    [HttpGet("{taskId}")]
    public async Task<IActionResult> GetTaskById(int taskId)
    {
        var task = await _mediator.Send(new GetTaskByIdQuery(taskId, GetUserId()));
        if (task == null)
        {
            return NotFound();
        }
        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
    {
        var createdTask = await _mediator.Send(new CreateTaskCommand(createTaskDto, GetUserId()));
        return CreatedAtAction(nameof(GetTaskById), new { taskId = createdTask.Id }, createdTask);
    }

    [HttpPut("{taskId}")]
    public async Task<IActionResult> UpdateTask(int taskId, [FromBody] UpdateTaskDto updateTaskDto)
    {
        var success = await _mediator.Send(new UpdateTaskCommand(taskId, updateTaskDto, GetUserId()));
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpDelete("{taskId}")]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var success = await _mediator.Send(new DeleteTaskCommand(taskId, GetUserId()));
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}