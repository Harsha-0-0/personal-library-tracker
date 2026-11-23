import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks, createBook } from "../api/books";
import type { Book } from "../api/books";

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");

  const loadBooks = () => getBooks().then(setBooks);

  useEffect(() => { loadBooks(); }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();           // stop the browser from reloading the page
    if (!title.trim()) return;    // don't add a book with no title

    await createBook({ title, author, genre });
    setTitle("");
    setAuthor("");
    setGenre("");
    loadBooks();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Library</h1>
      <form onSubmit={handleAddBook} className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-2">
        <input
          className="w-full border rounded p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <button className="bg-slate-800 text-white rounded px-4 py-2 text-sm">Add book</button>
      </form>
      <ul className="divide-y bg-white rounded-lg shadow-sm">
        {books.map((b) => (
          <li key={b.id} className="p-4 hover:bg-slate-50">
            <Link to={`/books/${b.id}`} className="flex justify-between">
              <span>{b.title} — {b.author}</span>
              <span className="text-sm text-slate-500">{b.status}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}