using LibraryTracker.Api.Data;
using LibraryTracker.Api.Dtos;
using LibraryTracker.Api.Models;
using LibraryTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryTracker.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokens;

    public AuthController(AppDbContext db, TokenService tokens)
    {
        _db = db;
        _tokens = tokens;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest("Email already registered.");

        var user = new User
        {
            Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = string.IsNullOrWhiteSpace(req.Role) ? "User" : req.Role
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokens.CreateToken(user);
        return Ok(new AuthResponse(token, user.Email, user.Role));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password.");

        var token = _tokens.CreateToken(user);
        return Ok(new AuthResponse(token, user.Email, user.Role));
    }
}