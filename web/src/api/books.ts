import api from "./client";
import type { ReadingLog } from "./readingLogs";
import type { Loan } from "./loans";

export type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  status: string;
  rating: number | null;
};

export type BookDetail = Book & {
  readingLogs: ReadingLog[];
  loans: Loan[];
};

export const getBooks = () => api.get<Book[]>("/books").then(r => r.data);
export const getBook = (id: number) => api.get<BookDetail>(`/books/${id}`).then(r => r.data);
export const createBook = (b: Partial<Book>) => api.post("/books", b).then(r => r.data);
export const deleteBook = (id: number) => api.delete(`/books/${id}`);