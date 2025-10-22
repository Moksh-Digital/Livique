import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// NOTE: Set this to your local backend URL (e.g., http://localhost:5000)
const API_BASE_URL = "http://localhost:5000/api/users";

const SignIn = () => {
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
            // Use AuthContext signIn method to properly update user state
            const success = await signIn(email, password);
            localStorage.setItem("token", data.token);
            
            if (success) {
                toast({
                    title: "Welcome Back!",
                    description: `Successfully signed in as ${data.name}.`
                });
                
                navigate("/"); // Redirect to home
            } else {
                toast({
                    title: "Sign In Failed",
                    description: "Failed to update user session.",
                    variant: "destructive"
                });
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
        <Link to="/forgot-password" className="text-primary hover:underline">
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

      <Button type="button" variant="outline" className="w-full h-11 rounded-xl">
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 rounded-2xl">
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
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignIn;
