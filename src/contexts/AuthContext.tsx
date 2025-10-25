import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE_URL = "http://localhost:5000/api/users";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Fetch user profile from JWT
  const fetchUserProfile = async (jwtToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Token invalid');
      }

      const userData = await response.json();
      setUser(userData as User);
    } catch (error) {
      console.error("JWT invalid or expired:", error);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // On mount: check for JWT or Admin
// Inside AuthContext.tsx

useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const adminFlag = localStorage.getItem('isAdminLoggedIn');

  if (storedToken) {
    setToken(storedToken);
    fetchUserProfile(storedToken);
  } else if (adminFlag === 'true') {
    setUser({ name: 'Admin', email: 'admin@shop.com', verified: true, role: 'admin' });
    setLoading(false);
  } else {
    setUser(null);
    setLoading(false);
  }
}, []);



  // JWT sign-in
  const signIn = async (jwtToken: string) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setLoading(true);
    await fetchUserProfile(jwtToken);
  };

  // Admin login (hardcoded)
// Admin login (hardcoded)
const signInAdmin = () => {
  localStorage.setItem('isAdminLoggedIn', 'true');
  setUser({ name: 'Admin', email: 'admin@shop.com', verified: true, role: 'admin' });
  setLoading(false); // important to stop loading state
};



  // Sign out
  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('isAdminLoggedIn');
  };

  // Check if logged-in user is admin
  const isAdmin = user?.email === 'admin@shop.com';

  // Loading state wrapper
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signInAdmin, signOut, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
