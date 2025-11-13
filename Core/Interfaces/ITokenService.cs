using Taskify.Core.Entities;

namespace Taskify.Core.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
}
