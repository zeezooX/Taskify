using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;
using Taskify.Core.DTOs;
using Taskify.Core.Interfaces;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("login")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(14),
            SameSite = SameSiteMode.Strict,
            Secure = true
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        try
        {
            var authResponse = await _authService.RegisterAsync(registerDto);
            if (authResponse == null)
            {
                return BadRequest(new { message = "Registration failed." });
            }
            SetRefreshTokenCookie(authResponse.RefreshToken);
            return Ok(new AuthResponseDto
            {
                Email = authResponse.Email,
                UserId = authResponse.UserId,
                Token = authResponse.Token
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        try
        {
            var authResponse = await _authService.LoginAsync(loginDto);
            if (authResponse == null)
            {
                return BadRequest(new { message = "Login failed." });
            }
            SetRefreshTokenCookie(authResponse.RefreshToken);
            return Ok(new AuthResponseDto
            {
                Email = authResponse.Email,
                UserId = authResponse.UserId,
                Token = authResponse.Token
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        try
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                return BadRequest(new { message = "Refresh token is missing." });
            }
            var authResponse = await _authService.RefreshTokenAsync(refreshToken);
            if (authResponse == null)
            {
                return BadRequest(new { message = "Token refresh failed." });
            }
            SetRefreshTokenCookie(authResponse.RefreshToken);
            return Ok(new AuthResponseDto
            {
                Email = authResponse.Email,
                UserId = authResponse.UserId,
                Token = authResponse.Token
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _authService.LogoutAsync(userId);
        Response.Cookies.Delete("refreshToken");
        return Ok(new { message = "Logged out successfully." });
    }

    [Authorize]
    [HttpPost("fcm-token")]
    public async Task<IActionResult> UpdateFcmToken([FromBody] FcmTokenDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _authService.UpdateFcmTokenAsync(userId, dto.Token);
        return Ok(new { message = "FCM token updated successfully." });
    }
}