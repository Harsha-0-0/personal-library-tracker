namespace LibraryTracker.Api.Models;

public class ReadingLog
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book? Book { get; set; }
    public string Type { get; set; } = "Session"; // Session / Note / Quote
    public string Notes { get; set; } = string.Empty;
    public int? PagesRead { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int CreatedByUserId { get; set; }
}