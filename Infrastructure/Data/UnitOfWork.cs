using Taskify.Core.Interfaces;
using Taskify.Infrastructure.Data.Repositories;

namespace Taskify.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    public ITaskRepository Tasks { get; private set; }
    public IUserRepository Users { get; private set; }
    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Tasks = new TaskRepository(_context);
        Users = new UserRepository(_context);
    }
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
    public void Dispose()
    {
        _context.Dispose();
    }
}