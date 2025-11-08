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
    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
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
        await _unitOfWork.SaveChangesAsync();
        var token = _tokenService.GenerateToken(user);
        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email
        };
    }
    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _unitOfWork.Users.GetUserByEmailAsync(loginDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password.");
        }
        var token = _tokenService.GenerateToken(user);
        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email
        };
    }
}
