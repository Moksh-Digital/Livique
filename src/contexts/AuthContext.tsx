import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api/users"          // local dev
  : "https://api.livique.co.in/api/users";    // production = droplet IP



interface User {
  name: string;
  email: string;
  verified: boolean;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (jwtToken: string) => Promise<void>;
  signInAdmin: () => void;
  signOut: () => void;
  loading: boolean;
  isAdmin: boolean;
  fetchGoogleUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Google OAuth session fetch
const fetchGoogleUser = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      credentials: "include",
    });

    if (res.status === 401) {
      setLoading(false);  // ✅ user not logged in
      return;
    }

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();
    setUser(data);
  } catch {
  } finally {
    setLoading(false);
  }
};


  // JWT user fetch
  const fetchUserProfile = async (jwtToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`, 
        },
      });

      if (!response.ok) throw new Error('Token invalid');

      const userData = await response.json();
      setUser(userData as User);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const adminFlag = localStorage.getItem('isAdminLoggedIn');

    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } 
    else if (adminFlag === 'true') {
      setUser({ name: 'Admin', email: 'admin@shop.com', verified: true, role: 'admin' });
      setLoading(false);
    }
    else {
      // ✅ check Google session
      fetchGoogleUser();
    }
  }, []);

  const signIn = async (jwtToken: string) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setLoading(true);
    await fetchUserProfile(jwtToken);
  };

  const signInAdmin = () => {
    localStorage.setItem('isAdminLoggedIn', 'true');
    setUser({ name: 'Admin', email: 'admin@shop.com', verified: true, role: 'admin' });
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('isAdminLoggedIn');

    // ✅ also logout Google session
    fetch(`${API_BASE_URL}/logout`, { credentials: "include" });
  };

  const isAdmin = user?.email === 'admin@shop.com';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signInAdmin, signOut, isAdmin, loading, fetchGoogleUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
