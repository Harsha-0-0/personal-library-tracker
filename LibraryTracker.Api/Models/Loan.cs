namespace LibraryTracker.Api.Models;

public class Loan
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book? Book { get; set; }
    public string BorrowerName { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = "OutOnLoan"; // OutOnLoan / Returned / Overdue
    public string Notes { get; set; } = string.Empty;
}