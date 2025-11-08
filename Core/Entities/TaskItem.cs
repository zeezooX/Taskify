namespace Taskify.Core.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = "New Task";
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; } = DateTime.UtcNow.AddDays(7);
    public bool IsCompleted { get; set; } = false;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}