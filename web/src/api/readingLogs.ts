import api from "./client";

export type ReadingLog = {
  id: number;
  bookId: number;
  type: string;
  date: string;
  notes: string | null;
  pagesRead: number | null;
};

export const createReadingLog =(bookId: number, log: Partial<ReadingLog>) => api.post(`/books/${bookId}/readinglogs`, log).then(r => r.data);

export const deleteReadingLog = (bookId: number, id: number) => api.delete(`/books/${bookId}/readinglogs/${id}`);