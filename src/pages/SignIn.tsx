"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Gift, Mail, Lock, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5000/api/users";

interface SignInProps {
  isModal?: boolean;
  onSignInSuccess?: () => void;
  onSwitchToSignUp?: () => void;
  onClose?: () => void;
}

const SignIn = ({ isModal = false, onSignInSuccess, onSwitchToSignUp, onClose }: SignInProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // ✅ Handle Google redirect token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get("token");

    if (jwtToken) {
      signIn(jwtToken);
      toast({ title: "Sign In Successful!", description: "You have been successfully signed in with Google." });

      urlParams.delete("token");
      const newPath = `${window.location.pathname}${urlParams.toString() ? "?" + urlParams.toString() : ""}`;

      if (isModal && onSignInSuccess) onSignInSuccess();
      else navigate(newPath || "/", { replace: true });
    }
  }, [signIn, toast, navigate, isModal, onSignInSuccess]);

  // ✅ Google Login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/users/auth/google?prompt=select_account";
  };

  // ✅ Send OTP
  const handleSendSigninOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/send-signin-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        toast({ title: "Verification Sent", description: data.message });
        setStep(2);
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to backend.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifySigninOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/verify-signin-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const jwtToken = data.token;
        signIn(jwtToken);
        toast({ title: "Welcome Back!", description: `Signed in as ${data.name}` });

        if (isModal && onSignInSuccess) onSignInSuccess();
        else navigate("/");
      } else {
        toast({ title: "Verification Failed", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sign In Form
  const renderSignInForm = () => (
    <form onSubmit={handleSendSigninOtp} className="space-y-6">
      <div>
        <Label htmlFor="email" className="font-semibold">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4 pr-12"
            required
          />
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="font-semibold">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4 pr-12"
            required
          />
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-gray-300 cursor-pointer"
          />
          <span className="text-gray-600">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-gray-600 hover:underline font-medium"
          onClick={isModal ? onSignInSuccess : undefined}>
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-lg bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916]
          text-white font-semibold"
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Login Account"}
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
        onClick={handleGoogleLogin}
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-5 w-5 mr-2" />
        Login with Google
      </Button>
    </form>
  );

  // ✅ OTP Verification Form
  const renderOtpVerification = () => (
    <form onSubmit={handleVerifySigninOtp} className="space-y-6">
      <p className="text-sm text-center text-gray-600">
        Verification code sent to <strong>{email}</strong>
      </p>

      <div>
        <Label htmlFor="otp" className="font-semibold">OTP Code</Label>
        <Input
          id="otp"
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
        {loading ? "Verifying..." : "Verify & Sign In"}
      </Button>

      <Button
        type="button"
        variant="link"
        onClick={() => { setStep(1); setOtp(""); }}
        disabled={loading}
        className="text-gray-600 hover:text-gray-900 w-full"
      >
        Change Details / Resend OTP
      </Button>
    </form>
  );

  // ✅ UI (with floating card layout)
  return (
    <div className="flex items-center justify-center p-4">
      {/* Mobile View */}
      <div className="flex md:hidden w-full flex-col items-center justify-center">
        <Card className="bg-white rounded-3xl p-8 shadow-xl border-0 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login to Account</h2>
          {step === 1 ? renderSignInForm() : renderOtpVerification()}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <button onClick={onSwitchToSignUp} className="text-[#7C2A25] font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </Card>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center relative h-[60vh]" style={{ width: "1000px" }}>
        <div className="w-[1000px] mx-auto relative">
          {/* Orange Header */}
          <div className="w-full bg-gradient-to-br from-[#8C2E2B] via-[#66201D] to-[#1A0B0A] rounded-t-3xl p-12 text-left shadow-lg">
            <h1 className="text-5xl font-bold text-white mb-6">Login to Account</h1>
            <p className="text-lg text-orange-50 leading-relaxed mb-12 mt-4 w-[70%]">
              Lorem ipsum dolor sit amet, consectetuer 
            </p>
            <p className="text-lg text-white">
              Don’t Have an Account?{" "}
              <button onClick={onSwitchToSignUp} className="underline font-semibold hover:opacity-90">
                Create Account
              </button>
            </p>
          </div>

          {/* Bottom Gray Section */}
         <div className="w-full bg-[#FFF2E0] rounded-b-3xl p-12 flex items-center justify-start shadow-inner">
          <div className="rounded-2xl h-56 w-96 overflow-hidden shadow-md ml-12">
            <img
              src="Logo.jpg"
              alt="Login Illustration"
              className="h-full w-full object-cover"
            />
          </div>
        </div>


          {/* Floating White Card */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-0 -translate-y-1/2 z-20"
            style={{
              left: "58%",
              top: "50%",
              width: "38%",
              minWidth: "320px",
              maxWidth: "520px",
              height: "70vh",
            }}
          >
            <Card className="bg-white rounded-3xl p-8 shadow-2xl border-0 w-full h-full flex flex-col justify-center relative">
              {/* Close Button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">User Information</h2>
              <div className="flex-grow">{step === 1 ? renderSignInForm() : renderOtpVerification()}</div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <button onClick={onSwitchToSignUp} className="text-[#7C2A25]
                
                
                
                
                font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
