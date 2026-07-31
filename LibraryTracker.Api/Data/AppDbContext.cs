using Microsoft.EntityFrameworkCore;
using LibraryTracker.Api.Models;

namespace LibraryTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<ReadingLog> ReadingLogs => Set<ReadingLog>();
    public DbSet<Loan> Loans => Set<Loan>();
}