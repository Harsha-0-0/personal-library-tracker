# Personal Library Tracker

A full-stack app for keeping track of your books: what you want to read, what you're reading now, your reading notes, and which books you've lent to friends.

## Tech stack

| Part | Technology |
| --- | --- |
| Back end | C#, ASP.NET Core Web API (.NET 10) |
| Database | SQLite with Entity Framework Core (code-first migrations) |
| Authentication | JWT tokens, passwords hashed with BCrypt |
| Front end | React, TypeScript, Vite, Tailwind CSS |

## Features

- **Books**: add, view, edit and delete books, with a status (Want to read, Reading, Read) and a 1–5 rating
- **Reading logs**: record reading sessions, notes and quotes for each book
- **Loans**: track who borrowed a book and when it's due back
- **Accounts**: register and log in; all book, reading log and loan endpoints need a valid token
- **Roles**: deleting a book is limited to admins (`[Authorize(Roles = "Admin")]`). New accounts are always normal users, because the server decides roles, never the client

## How it's built

```
React front end  ──HTTP + JWT──▶  ASP.NET Core API  ──EF Core──▶  SQLite
 (localhost:5173)                   (localhost:5296)
```

- **Controllers** (`BooksController`, `ReadingLogsController`, `LoansController`, `AuthController`) handle the REST endpoints and return standard status codes: 200, 201, 204, 400, 401 and 404.
- **Dependency injection**: ASP.NET Core creates the database context and `TokenService` and passes them into each controller through its constructor.
- **TokenService** creates signed JWTs that hold the user's ID, email and role, and expire after 8 hours.

## Running it locally

You need the [.NET 10 SDK](https://dotnet.microsoft.com/download) and [Node.js](https://nodejs.org/).

**1. Back end**

```bash
cd LibraryTracker.Api

# One-time: set a secret key for signing tokens (at least 32 characters)
dotnet user-secrets set "Jwt:Key" "replace-this-with-a-long-random-secret-key"

# Create the database and run the API
dotnet ef database update
dotnet run
```

The API runs at `http://localhost:5296`. Swagger UI for trying the endpoints is at `http://localhost:5296/swagger`.

(`dotnet ef` needs the EF Core tools: `dotnet tool install --global dotnet-ef`.)

**2. Front end**, in a second terminal:

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:5173`, create an account and start adding books.

**Making an admin account:** register normally, then update the role in the database:

```bash
sqlite3 LibraryTracker.Api/librarytracker.db "UPDATE Users SET Role = 'Admin' WHERE Email = 'you@example.com';"
```

Log out and back in to get a token with the new role.

## Next steps

- Unit tests with xUnit for authentication, tokens and the book endpoints
- An AI reading assistant that uses Claude tool use to look up and summarise your library
- Request DTOs and validation for books, such as a rating between 1 and 5
- A service layer between the controllers and the database, so business logic is easier to test
- Per-user libraries, so each account sees only its own books
