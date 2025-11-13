namespace Taskify.Core.DTOs;

public class TaskQueryParameters
{
    private const int MaxPageSize = 50;

    private int _pageNumber = 1;
    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = (value < 1) ? 1 : value;
    }

    private int _pageSize = 10;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }

    public bool? IsCompleted { get; set; }

    public string? SortBy { get; set; } // e.g., "Title", "DueDate"

    public bool IsDescending { get; set; } = false;
}
