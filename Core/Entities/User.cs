namespace Taskify.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public ICollection<TaskItem> TaskItems { get; set; } = new List<TaskItem>();
}