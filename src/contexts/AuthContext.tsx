import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// NOTE: Set this to your local backend URL (e.g., http://localhost:5000)
const API_BASE_URL = "http://localhost:5000/api/users";

interface User {
  name: string;
  email: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  // signIn/signUp no longer take password here, as they are handled in the component flow
  signIn: (token: string) => void; // Function to set the token and fetch profile
  signOut: () => void;
  loading: boolean;
  isAdmin: boolean; // Will be determined by the backend data later, placeholder for now
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // --- Fetch User Profile using JWT ---
  const fetchUserProfile = async (jwtToken: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          // THIS IS THE KEY: Sending the token to the protected route
          'Authorization': `Bearer ${jwtToken}`, 
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // The backend /profile route returns { name, email, verified }
        setUser(userData as User);
        return true;
      }
      
      // If token is invalid/expired, clear it
      console.error("JWT is invalid or expired. Clearing session.");
      localStorage.removeItem('token');
      setUser(null);
      return false;

    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem('token');
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };


  // --- On Component Mount: Check for existing JWT and validate it ---
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken); // Validate the stored token
    } else {
      setLoading(false);
    }
  }, []);


  // --- Authentication Actions ---
  
  // New signIn function: takes the *validated* token from the sign-in flow
  const signIn = (jwtToken: string) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    fetchUserProfile(jwtToken);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // isAdmin is a placeholder. In a full app, the /profile response would include 'isAdmin'
  const isAdmin = user?.email === 'admin@shop.com'; // Placeholder check

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};