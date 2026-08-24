import api from "./client";

export type Loan = {
  id: number;
  bookId: number;
  borrowerName: string;
  dueDate: string;
  status: string;
  notes: string;
};

export const createLoan = (bookId: number, loan: Partial<Loan>) =>
  api.post(`/books/${bookId}/loans`, loan).then(r => r.data);

export const deleteLoan = (bookId: number, id: number) =>
  api.delete(`/books/${bookId}/loans/${id}`);