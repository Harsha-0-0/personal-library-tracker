using LibraryTracker.Api.Data;
using LibraryTracker.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryTracker.Api.Controllers;

[ApiController]
[Route("api/books")]
[Authorize] // any logged-in user
public class BooksController : ControllerBase
{
    private readonly AppDbContext _db;
    public BooksController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Books.OrderByDescending(b => b.CreatedAt).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var book = await _db.Books
            .Include(b => b.ReadingLogs)
            .Include(b => b.Loans)
            .FirstOrDefaultAsync(b => b.Id == id);
        return book == null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Book book)
    {
        _db.Books.Add(book);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Book input)
    {
        var book = await _db.Books.FindAsync(id);
        if (book == null) return NotFound();

        book.Title = input.Title;
        book.Author = input.Author;
        book.Genre = input.Genre;
        book.Status = input.Status;
        book.Rating = input.Rating;
        await _db.SaveChangesAsync();
        return Ok(book);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // only admins can delete
    public async Task<IActionResult> Delete(int id)
    {
        var book = await _db.Books.FindAsync(id);
        if (book == null) return NotFound();

        _db.Books.Remove(book);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}