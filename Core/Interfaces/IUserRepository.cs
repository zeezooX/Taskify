using Taskify.Core.Entities;

namespace Taskify.Core.Interfaces;

public interface IUserRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(int userId);
    Task<User> AddUserAsync(User user);
    Task<User?> GetUserByRefreshTokenAsync(string refreshToken);
}