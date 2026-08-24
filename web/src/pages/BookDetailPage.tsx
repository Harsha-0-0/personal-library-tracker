import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBook, type BookDetail } from "../api/books";
import { createReadingLog, deleteReadingLog } from "../api/readingLogs";
import { createLoan, deleteLoan } from "../api/loans";

export default function BookDetailPage() {
  const { id } = useParams();
  const bookId = Number(id);
  const [book, setBook] = useState<BookDetail | null>(null);

  const [logNotes, setLogNotes] = useState("");
  const [logPages, setLogPages] = useState("");

  const [loanBorrower, setLoanBorrower] = useState("");
  const [loanDueDate, setLoanDueDate] = useState("");

  const refresh = () => getBook(bookId).then(setBook);

  useEffect(() => { refresh(); }, [bookId]);

  if (!book) return <div className="p-6">Loading...</div>;

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReadingLog(bookId, {
      type: "Session",
      notes: logNotes,
      pagesRead: logPages ? Number(logPages) : null,
    });
    setLogNotes("");
    setLogPages("");
    refresh();
  };

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLoan(bookId, {
      borrowerName: loanBorrower,
      dueDate: loanDueDate,
      status: "OutOnLoan",
    });
    setLoanBorrower("");
    setLoanDueDate("");
    refresh();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <Link to="/books" className="text-sm text-slate-500 hover:underline">&larr; Back to library</Link>

      <div>
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <p className="text-slate-600">{book.author} · {book.genre} · {book.status}</p>
      </div>

      {/* Reading Logs */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Reading Logs</h2>
        <ul className="space-y-2 mb-4">
          {book.readingLogs.map((log) => (
            <li key={log.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">{new Date(log.date).toLocaleDateString()} · {log.type}{log.pagesRead ? ` · ${log.pagesRead}pg` : ""}</p>
                <p>{log.notes}</p>
              </div>
              <button
                onClick={() => deleteReadingLog(bookId, log.id).then(refresh)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddLog} className="bg-white p-3 rounded shadow-sm space-y-2">
          <textarea
            className="w-full border rounded p-2"
            placeholder="What did you read/think?"
            value={logNotes}
            onChange={(e) => setLogNotes(e.target.value)}
          />
          <input
            className="w-full border rounded p-2"
            type="number"
            placeholder="Pages read (optional)"
            value={logPages}
            onChange={(e) => setLogPages(e.target.value)}
          />
          <button className="bg-slate-800 text-white rounded px-4 py-2 text-sm">Add reading log</button>
        </form>
      </section>

      {/* Loans */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Loans</h2>
        <ul className="space-y-2 mb-4">
          {book.loans.map((loan) => (
            <li key={loan.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-start">
              <div>
                <p>{loan.borrowerName} — due {new Date(loan.dueDate).toLocaleDateString()}</p>
                <p className="text-sm text-slate-500">{loan.status}</p>
              </div>
              <button
                onClick={() => deleteLoan(bookId, loan.id).then(refresh)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddLoan} className="bg-white p-3 rounded shadow-sm space-y-2">
          <input
            className="w-full border rounded p-2"
            placeholder="Borrower name"
            value={loanBorrower}
            onChange={(e) => setLoanBorrower(e.target.value)}
          />
          <input
            className="w-full border rounded p-2"
            type="date"
            value={loanDueDate}
            onChange={(e) => setLoanDueDate(e.target.value)}
          />
          <button className="bg-slate-800 text-white rounded px-4 py-2 text-sm">Add loan</button>
        </form>
      </section>
    </div>
  );
}