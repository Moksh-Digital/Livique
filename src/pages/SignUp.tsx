import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext"; // Import updated AuthContext
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

// NOTE: Set this to your local backend URL (e.g., http://localhost:5000)
const API_BASE_URL = "http://localhost:5000/api/users";

const SignUp = () => {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP Verification
  const [loading, setLoading] = useState(false);

  // Step 1 State: Credentials
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2 State: OTP
  const [otp, setOtp] = useState("");

  // ✅ FIX 1: Import the new token-based 'signIn' function instead of the old mock 'signUp'
  const { signIn } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();

  // --- STEP 1: SEND OTP to Email ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
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

  // --- STEP 2: VERIFY OTP and Finalize Registration ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const jwtToken = data.token; // Get the JWT token from the backend response

        // ✅ FIX 2: Use the imported 'signIn' function to establish the session with the token
        signIn(jwtToken); 

        toast({
          title: "Welcome!",
          description: `Successfully signed up and logged in as ${data.name}.`
        });

        navigate("/"); // Redirect to home

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

  const renderSignUpForm = () => (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Full Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="h-12 rounded-xl"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-12 rounded-xl"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className="h-12 rounded-xl"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Confirm Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="h-12 rounded-xl"
          required
        />
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? "Sending OTP..." : "Sign Up"}
      </Button>
    </form>
  );

  const renderOtpVerification = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <p className="text-sm text-center text-muted-foreground">
        A verification code has been sent to **{email}**. Please check your inbox and spam folder.
      </p>

      <div>
        <label className="text-sm font-medium mb-2 block">OTP Code</label>
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.slice(0, 6))}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="h-12 rounded-xl text-center text-xl font-bold tracking-widest"
          required
        />
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? "Verifying..." : "Verify & Create Account"}
      </Button>

      <Button type="button" variant="link" className="w-full" onClick={() => { setStep(1); setOtp(""); }} disabled={loading}>
        Change Details / Resend OTP
      </Button>
    </form>
  );


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12">
        <Card className="p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-2">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {step === 1 ? "Join us for a delightful shopping experience" : "Enter the code sent to your inbox"}
          </p>

          {step === 1 ? renderSignUpForm() : renderOtpVerification()}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SignUp;