import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../api/books";
import type { Book } from "../api/books";

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => { getBooks().then(setBooks); }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Library</h1>
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