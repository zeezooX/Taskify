using Microsoft.AspNetCore.Mvc;
using Taskify.Core.DTOs;
using Taskify.Core.Interfaces;

namespace Taskify.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        try
        {
            var authResponse = await _authService.RegisterAsync(registerDto);
            return Ok(authResponse);
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
            return Ok(authResponse);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}