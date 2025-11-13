using AutoMapper;
using MediatR;
using Taskify.Core.DTOs;
using Taskify.Core.Interfaces;

namespace Taskify.Application.Handlers.Tasks.Commands;

public record UpdateTaskCommand(int TaskId, UpdateTaskDto TaskDto, int UserId) : IRequest<bool>;
public class UpdateTaskCommandHandler : IRequestHandler<UpdateTaskCommand, bool>
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    public UpdateTaskCommandHandler(IMapper mapper, IUnitOfWork unitOfWork)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }
    public async Task<bool> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetTaskByIdAsync(request.TaskId);
        if (task is null || task.UserId != request.UserId)
        {
            throw new KeyNotFoundException("Task not found or access denied.");
        }
        _mapper.Map(request.TaskDto, task);
        _unitOfWork.Tasks.UpdateTask(task);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
