namespace Taskify.Core.DTOs;

public class AuthResponseDto
{
    public string Email { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Token { get; set; } = string.Empty;
}
