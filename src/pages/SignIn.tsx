import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
// FIX: Reverting to the path alias, which works in the associated SignUp.tsx file, 
// as the relative path proved incorrect for the current environment structure.
import { useAuth } from "@/contexts/AuthContext"; 
import { useToast } from "@/hooks/use-toast";

// NOTE: Set this to your local backend URL (e.g., http://localhost:5000)
const API_BASE_URL = "http://localhost:5000/api/users";

// Props for the modal implementation
interface SignInProps {
  isModal?: boolean;
  onSignInSuccess?: () => void;
  onSwitchToSignUp?: () => void; // Defined for modal switching
}

const SignIn = ({ isModal = false, onSignInSuccess, onSwitchToSignUp }: SignInProps) => {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP Verification
  const [loading, setLoading] = useState(false);

  // Step 1 State: Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 State: OTP
  const [otp, setOtp] = useState("");

  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // ----------------------------------------------------------------------
  // ✅ Handle JWT Token from Google Redirect
  // This useEffect runs once on load to check for a JWT token in the URL.
  // ----------------------------------------------------------------------
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get('token');

    if (jwtToken) {
      // 1. Establish the session using the received token
      signIn(jwtToken);

      // 2. Notify the user
      toast({
        title: "Sign In Successful!",
        description: "You have been successfully signed in with Google."
      });
      
      // 3. Clean the URL (remove the token) and redirect
      urlParams.delete('token');
      const newPath = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      
      // Navigate to home or trigger modal success callback
      if (isModal && onSignInSuccess) {
        onSignInSuccess();
      } else {
        // Use navigate with 'replace: true' to prevent user from going back to the tokenized URL
        navigate(newPath || "/", { replace: true });
      }
    }
  }, [signIn, toast, navigate, isModal, onSignInSuccess]);

  const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/api/users/auth/google?prompt=select_account";
};


  // --- STEP 1: SEND OTP for Sign In ---
  const handleSendSigninOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/send-signin-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Verification Sent",
          description: data.message, // "OTP sent successfully..."
        });
        setStep(2); // Move to OTP verification step
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send OTP. Check backend server.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the backend server. Is it running?",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP and Complete Sign In ---
  const handleVerifySigninOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/verify-signin-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const jwtToken = data.token; // Get the JWT token from the backend response

        signIn(jwtToken);

        toast({
          title: "Welcome Back!",
          description: `Sign in successful as ${data.name}.`
        });

        // MODAL LOGIC: If in modal, call success callback to close it
        if (isModal && onSignInSuccess) {
          onSignInSuccess();
        } else {
          // If not in modal (full page), redirect to home
          navigate("/");
        }

      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid or expired OTP.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER FUNCTIONS ---

  const renderSignInForm = () => (
    <form onSubmit={handleSendSigninOtp} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1"
          required
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span>Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-primary hover:underline"
            onClick={isModal ? () => onSignInSuccess && onSignInSuccess() : undefined} // Close modal before navigating away
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? "Sending OTP..." : "Sign In"}
      </Button>

      <div className="relative text-center text-sm text-muted-foreground">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <span className="relative bg-card px-4">or continue with</span>
      </div>

<Button
  type="button"
  variant="outline"
  className="w-full h-11 rounded-xl mt-3"
  onClick={handleGoogleLogin}
>
  <img
    src="https://www.svgrepo.com/show/355037/google.svg"
    alt="Google Logo"
    className="h-5 w-5 mr-2"
  />
  Sign in with Google
</Button>
    </form>
  );

  const renderOtpVerification = () => (
    <form onSubmit={handleVerifySigninOtp} className="space-y-4">
      <p className="text-sm text-center text-muted-foreground">
        A verification code has been sent to **{email}**. Please check your inbox and spam folder.
      </p>

      <div>
        <Label htmlFor="otp">OTP Code</Label>
        <Input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.slice(0, 6))}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="mt-1 h-12 rounded-xl text-center text-xl font-bold tracking-widest"
          required
        />
      </div>

      <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? "Verifying..." : "Verify & Sign In"}
      </Button>

      <Button type="button" variant="link" className="w-full" onClick={() => { setStep(1); setOtp(""); }} disabled={loading}>
        Change Details / Resend OTP
      </Button>
    </form>
  );

  return (
    // Conditional styling for full page vs modal
    <div className={isModal ? "p-0 w-full" : "min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center p-4"}>
      <Card 
        // Conditional styling for Card container
        className={isModal ? "w-full p-8 shadow-none border-none bg-transparent" : "w-full max-w-md p-8 rounded-2xl"}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold text-accent mb-2">
            <Gift className="h-8 w-8" />
            <span>Livique</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">
            {step === 1 ? "Welcome Back" : "Verify Email"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Sign in to your account" : "Enter the code sent to your inbox"}
          </p>
        </div>

        {step === 1 ? renderSignInForm() : renderOtpVerification()}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          {/* Switch to Sign Up modal using the prop handler */}
          <button
            type="button"
            className="text-primary font-semibold hover:underline"
            onClick={isModal && onSwitchToSignUp ? onSwitchToSignUp : () => navigate("/signup")}
          >
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
};

export default SignIn;