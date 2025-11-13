using Taskify.Core.DTOs;
using Taskify.Core.Entities;
using Taskify.Core.Interfaces;

namespace Taskify.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    public AuthService(IUnitOfWork unitOfWork, ITokenService tokenService)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
    }
    public async Task<AuthenticatedUserResponse?> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await _unitOfWork.Users.GetUserByEmailAsync(registerDto.Email);
        if (existingUser != null)
        {
            throw new Exception("User with this email already exists.");
        }
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = passwordHash
        };
        await _unitOfWork.Users.AddUserAsync(user);
        var token = _tokenService.GenerateToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(14);
        await _unitOfWork.SaveChangesAsync();
        return new AuthenticatedUserResponse(user.Email, user.Id, token, refreshToken);
    }
    public async Task<AuthenticatedUserResponse?> LoginAsync(LoginDto loginDto)
    {
        var user = await _unitOfWork.Users.GetUserByEmailAsync(loginDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password.");
        }
        var token = _tokenService.GenerateToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(14);
        await _unitOfWork.SaveChangesAsync();
        return new AuthenticatedUserResponse(user.Email, user.Id, token, user.RefreshToken);
    }
    public async Task<AuthenticatedUserResponse?> RefreshTokenAsync(string refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            throw new Exception("Refresh token is required.");
        }
        var user = await _unitOfWork.Users.GetUserByRefreshTokenAsync(refreshToken);
        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new Exception("Invalid or expired refresh token.");
        }
        var newToken = _tokenService.GenerateToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(14);
        await _unitOfWork.SaveChangesAsync();
        return new AuthenticatedUserResponse(user.Email, user.Id, newToken, newRefreshToken);
    }
    public async Task<bool> LogoutAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetUserByIdAsync(userId);
        if (user == null)
        {
            return false;
        }
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
