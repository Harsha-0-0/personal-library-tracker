namespace LibraryTracker.Api.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Status { get; set; } = "WantToRead"; // WantToRead / Reading / Read
    public int? Rating { get; set; } // 1-5, set once finished
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<ReadingLog> ReadingLogs { get; set; } = new();
    public List<Loan> Loans { get; set; } = new();
}