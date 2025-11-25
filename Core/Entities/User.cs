namespace Taskify.Core.Entities;

public class User : BaseEntity
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public ICollection<TaskItem> TaskItems { get; set; } = new List<TaskItem>();
    public string? FcmToken { get; set; }
}