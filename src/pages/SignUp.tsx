"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ✅ AUTO SWITCH API BASE URL
// ✅ AUTO SWITCH API BASE URL
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api/users"          // local dev
  : "https://api.livique.co.in/api/users";    // production = droplet IP



interface SignUpProps {
  isModal?: boolean;
  onSignUpSuccess?: () => void;
  onSwitchToSignIn?: () => void;
  onClose?: () => void;
}

const SignUp = ({ isModal = false, onSignUpSuccess, onSwitchToSignIn, onClose }: SignUpProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // ✅ Step 1 - Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Verification Sent", description: data.message });
        setStep(2);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send OTP.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network Error",
        description: "Could not connect to the backend server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2 - Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        signIn(data.token);
        toast({ title: "Welcome!", description: `Signed up as ${data.name}` });
        if (isModal && onSignUpSuccess) onSignUpSuccess();
        else navigate("/");
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid OTP.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network Error",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 1 Form
  const renderSignUpForm = () => (
    <form onSubmit={handleSendOtp} className="space-y-2">
      <div>
        <Label className="font-semibold">Full Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4"
          required
        />
      </div>

      <div>
        <Label className="font-semibold">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4"
          required
        />
      </div>

      <div>
        <Label className="font-semibold">Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4"
          required
        />
      </div>

      <div>
        <Label className="font-semibold">Confirm Password</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-lg bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916] text-white font-semibold"
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Create Account"}
      </Button>

      <div className="relative text-center text-sm text-gray-500">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <span className="relative bg-white px-3">or</span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
        onClick={() => (window.location.href = `${API_BASE_URL}/auth/google`)}
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="h-5 w-5 mr-2"
        />
        Sign up with Google
      </Button>
    </form>
  );

  // ✅ Step 2 Form
  const renderOtpVerification = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
      <p className="text-sm text-center text-gray-600">
        A code has been sent to <strong>{email}</strong>
      </p>

      <div>
        <Label className="font-semibold">OTP Code</Label>
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.slice(0, 6))}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="h-12 text-center text-xl font-bold tracking-widest"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify & Create Account"}
      </Button>

      <Button
        type="button"
        variant="link"
        onClick={() => {
          setStep(1);
          setOtp("");
        }}
        className="text-gray-600 hover:text-gray-900 w-full"
        disabled={loading}
      >
        Change Details / Resend OTP
      </Button>
    </form>
  );

  // ✅ Layout (same as SignIn)
  return (
    <div className="flex items-center justify-center p-4">
      {/* Mobile */}
      <div className="flex md:hidden w-full flex-col items-center justify-center">
        <Card className="bg-white rounded-3xl p-8 shadow-xl border-0 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
          {step === 1 ? renderSignUpForm() : renderOtpVerification()}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <button onClick={onSwitchToSignIn} className="text-[#7C2A25] font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </Card>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center relative h-[60vh]" style={{ width: "1000px" }}>
        <div className="w-[1000px] mx-auto relative">
          {/* Header */}
          <div className="w-full bg-gradient-to-br from-[#8C2E2B] via-[#66201D] to-[#1A0B0A] rounded-t-3xl p-12 text-left shadow-lg">
            <h1 className="text-5xl font-bold text-white mb-6">Create Account</h1>
            <p className="text-lg text-orange-50 leading-relaxed mb-12 mt-4 w-[70%]">
              Lorem ipsum dolor sit amet, consectetuer
            </p>

            <p className="text-lg text-white">
              Already have an Account?{" "}
              <button onClick={onSwitchToSignIn} className="underline font-semibold hover:opacity-90">
                Login
              </button>
            </p>
          </div>

          {/* Bottom Section */}
          <div className="w-full bg-[#FFF2E0] rounded-b-3xl p-12 flex items-center justify-start shadow-inner">
            <div className="rounded-2xl h-56 w-96 overflow-hidden shadow-md ml-12">
              <img src="Logo.jpg" alt="Signup Illustration" className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Floating Card */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-0 -translate-y-1/2 z-20"
            style={{
              left: "58%",
              top: "50%",
              width: "38%",
              minWidth: "320px",
              maxWidth: "520px",
              height: "75vh",
            }}
          >
            <Card className="bg-white rounded-3xl p-8 shadow-2xl border-0 w-full h-full flex flex-col justify-center relative">
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 md:hidden"
                >
                  {/* <X className="h-5 w-5" /> */}
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">User Information</h2>
              <div className="flex-grow">{step === 1 ? renderSignUpForm() : renderOtpVerification()}</div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <button onClick={onSwitchToSignIn} className="text-[#7C2A25] font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
