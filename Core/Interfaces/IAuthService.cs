using Taskify.Core.DTOs;

namespace Taskify.Core.Interfaces;

public interface IAuthService
{
    Task<AuthenticatedUserResponse?> RegisterAsync(RegisterDto registerDto);
    Task<AuthenticatedUserResponse?> LoginAsync(LoginDto loginDto);
    Task<AuthenticatedUserResponse?> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(int userId);
    Task<bool> UpdateFcmTokenAsync(int userId, string fcmToken);
}
