using LibraryTracker.Api.Data;
using LibraryTracker.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryTracker.Api.Controllers;

[ApiController]
[Route("api/books/{bookId}/loans")]
[Authorize] // any logged-in user
public class LoansController : ControllerBase
{
    private readonly AppDbContext _db;

    public LoansController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll(int bookId) =>
        Ok(await _db.Loans.Where(l => l.BookId == bookId).OrderByDescending(l => l.DueDate).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(int bookId, Loan loan)
    {
        var book = await _db.Books.FindAsync(bookId);
        if (book == null) return NotFound();
        loan.BookId = bookId;
        _db.Loans.Add(loan);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { bookId }, loan);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int bookId, int id, Loan input)
    {
        var loan = await _db.Loans.FindAsync(id);
        if (loan == null) return NotFound();
        loan.DueDate = input.DueDate;
        loan.BorrowerName = input.BorrowerName;
        loan.Notes = input.Notes;
        loan.Status = input.Status;
        await _db.SaveChangesAsync();
        return Ok(loan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int bookId, int id)
    {
        var loan = await _db.Loans.FindAsync(id);
        if (loan == null) return NotFound();
        _db.Loans.Remove(loan);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}