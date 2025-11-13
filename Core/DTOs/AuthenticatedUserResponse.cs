namespace Taskify.Core.DTOs;

public record AuthenticatedUserResponse(
    string Email,
    int UserId,
    string Token,
    string RefreshToken
);