import { createContext, useContext, useEffect, useState, ReactNode } from "react";


type AppRole = "student" | "professor";

interface AuthContextType {
  user: any | null; // Changed from Supabase User
  role: AppRole | null;
  loading: boolean;
  signUp: (email: string, password: string, role: AppRole, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setToken: (token: string | null) => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setTokenState] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const signInWithGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    return { error: null };
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  const signUp = async (email: string, password: string, role: AppRole, fullName?: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, displayName: fullName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setToken(data.token);
      return { error: null };
    } catch (error: any) {
      return { error: error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      return { error: null };
    } catch (error: any) {
      return { error: error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null, // Derived from user object
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        setToken,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
