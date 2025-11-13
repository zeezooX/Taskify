using MediatR;
using Taskify.Core.Interfaces;

namespace Taskify.Application.Handlers.Tasks.Commands;

public record DeleteTaskCommand(int TaskId, int UserId) : IRequest<bool>;
public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteTaskCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    public async Task<bool> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetTaskByIdAsync(request.TaskId);
        if (task is null || task.UserId != request.UserId)
        {
            throw new KeyNotFoundException("Task not found or access denied.");
        }
        _unitOfWork.Tasks.DeleteTask(task);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
