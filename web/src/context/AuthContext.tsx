import { createContext, useContext, useState, type ReactNode } from "react";

type AuthState = { token: string | null; email: string | null; role: string | null };
type AuthContextType = AuthState & {
  login: (token: string, email: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem("token"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  });

  const login = (token: string, email: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    setState({ token, email, role });
  };

  const logout = () => {
    localStorage.clear();
    setState({ token: null, email: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}