using LibraryTracker.Api.Data;
using LibraryTracker.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryTracker.Api.Controllers;

[ApiController]
[Route("api/books/{bookId}/readinglogs")]
[Authorize] // any logged-in user
public class ReadingLogsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReadingLogsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll(int bookId) =>
        Ok(await _db.ReadingLogs.Where(r => r.BookId == bookId).OrderByDescending(r =>r.Date).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(int bookId, ReadingLog readingLog)
    {
        var book = await _db.Books.FindAsync(bookId);
        if (book == null) return NotFound();
        readingLog.BookId = bookId;
        _db.ReadingLogs.Add(readingLog);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { bookId }, readingLog);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int bookId, int id, ReadingLog input)
    {
        var readingLog = await _db.ReadingLogs.FindAsync(id);
        if (readingLog == null) return NotFound();
        readingLog.Type = input.Type;
        readingLog.Notes = input.Notes;
        readingLog.Date = input.Date;
        readingLog.PagesRead = input.PagesRead;
        await _db.SaveChangesAsync();
        return Ok(readingLog);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int bookId, int id)
    {
        var readingLog = await _db.ReadingLogs.FindAsync(id);
        if (readingLog == null) return NotFound();
        _db.ReadingLogs.Remove(readingLog);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}