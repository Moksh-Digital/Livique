"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Attempting to fix path resolution by removing parent directory (../) references for UI components/hooks
// The actual path resolution depends heavily on your project's configuration (tsconfig.json or bundler config).
// The following paths are a common standard if these files are located in sibling directories:
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Mail, Lock, X, ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react"; 
import { useAuth } from "../contexts/AuthContext"; 
import { useToast } from "../hooks/use-toast"; 

const API_BASE_URL = "http://localhost:5000/api/users";

interface SignInProps {
  isModal?: boolean;
  onSignInSuccess?: () => void;
  onSwitchToSignUp?: () => void;
  onClose?: () => void;
}

// Custom step map to manage the UI state
const UI_STEPS = {
  SIGN_IN: 1,
  SIGN_IN_OTP: 2,
  FORGOT_EMAIL: 3,
  FORGOT_OTP: 4,
  SET_NEW_PASSWORD: 5,
};

const SignIn = ({ isModal = false, onSignInSuccess, onSwitchToSignUp, onClose }: SignInProps) => {
  const [step, setStep] = useState(UI_STEPS.SIGN_IN);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // --- Password Visibility State ---
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);

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

  // Helper function to reset local state for Sign In/Forgot Password switch
  const handleStartOver = (newStep = UI_STEPS.SIGN_IN) => {
    setStep(newStep);
    setEmail("");
    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setLoading(false);
  };

  // ✅ Google Login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/users/auth/google?prompt=select_account";
  };

  // ------------------------------------------------------------------
  // --- SIGN IN FLOW HANDLERS ----------------------------------------
  // ------------------------------------------------------------------

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
        setStep(UI_STEPS.SIGN_IN_OTP);
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
  
  // ------------------------------------------------------------------
  // --- FORGOT PASSWORD FLOW HANDLERS --------------------------------
  // ------------------------------------------------------------------

  // ✅ Step 1: Request Password Reset (Send OTP)
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      // Backend sends 200 even if user is not found, to prevent enumeration
      if (response.ok) {
        toast({ title: "Code Sent", description: data.message });
        setStep(UI_STEPS.FORGOT_OTP);
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to backend.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Validate Reset Token (OTP)
  const handleValidateResetToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/validate-reset-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: otp }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast({ title: "Code Validated", description: data.message });
        setStep(UI_STEPS.SET_NEW_PASSWORD);
        // Note: OTP state is kept here to be used as the token in the next step (handleSetNewPassword)
      } else {
        toast({ title: "Validation Failed", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 3: Set New Password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      setLoading(false);
      return;
    }
    
    // Ensure the new password is at least 6 characters long (backend check added for redundancy)
    if (newPassword.length < 6) {
        toast({ title: "Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use the OTP state as the token for the final reset
        body: JSON.stringify({ email, token: otp, newPassword }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast({ title: "Success", description: data.message });
        handleStartOver(UI_STEPS.SIGN_IN); // Go back to main sign-in form
      } else {
        toast({ title: "Password Reset Failed", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  // ------------------------------------------------------------------
  // --- UI RENDER FUNCTIONS ------------------------------------------
  // ------------------------------------------------------------------

  // ✅ Sign In Form (STEP 1)
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
            type={passwordVisible ? "text" : "password"} // Dynamic type
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
            className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 p-0"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
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
        <button 
          type="button" 
          className="text-gray-600 hover:underline font-medium"
          onClick={() => handleStartOver(UI_STEPS.FORGOT_EMAIL)}
        >
          Forgot Password?
        </button>
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

  // ✅ OTP Verification Form (STEP 2)
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
        className="w-full h-12 rounded-lg bg-gradient-to-r from-[#A7443F] to-[#7C2A25] text-white font-semibold"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify & Sign In"}
      </Button>

      <Button
        type="button"
        variant="link"
        onClick={() => { setStep(UI_STEPS.SIGN_IN); setOtp(""); }}
        disabled={loading}
        className="text-gray-600 hover:text-gray-900 w-full"
      >
        Change Details / Resend OTP
      </Button>
    </form>
  );


  // ------------------------------------------------------------------
  // --- FORGOT PASSWORD UI RENDER FUNCTIONS --------------------------
  // ------------------------------------------------------------------

  // ✅ Forgot Password: Enter Email (STEP 3)
  const renderForgotPasswordEmail = () => (
    <div className="space-y-6">
      <button 
        onClick={() => handleStartOver(UI_STEPS.SIGN_IN)} 
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Login
      </button>
      <h3 className="text-xl font-bold text-gray-900 text-center">Forgot Password</h3>
      <p className="text-sm text-center text-gray-600">
        Enter your registered email address to receive a password reset code.
      </p>
      <form onSubmit={handleRequestPasswordReset} className="space-y-6">
        <div>
          <Label htmlFor="reset-email" className="font-semibold">Email</Label>
          <div className="relative">
            <Input
              id="reset-email"
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
        <Button
          type="submit"
          className="w-full h-12 rounded-lg bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916]
          text-white font-semibold"
          disabled={loading}
        >
          {loading ? "Sending Code..." : "Send Reset Code"}
        </Button>
      </form>
    </div>
  );

  // ✅ Forgot Password: Verify OTP (STEP 4)
  const renderForgotPasswordOtp = () => (
    <form onSubmit={handleValidateResetToken} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 text-center">Verify Reset Code</h3>
      <p className="text-sm text-center text-gray-600">
        A 6-digit verification code has been sent to <strong>{email}</strong>
      </p>

      <div>
        <Label htmlFor="reset-otp" className="font-semibold">Reset Code</Label>
        <Input
          id="reset-otp"
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
        className="w-full h-12 rounded-lg bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916]
          text-white font-semibold"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </Button>

      <Button
        type="button"
        variant="link"
        onClick={() => handleRequestPasswordReset({ preventDefault: () => {} } as React.FormEvent)}
        disabled={loading}
        className="text-gray-600 hover:text-gray-900 w-full"
      >
        Resend Code
      </Button>
      <Button
        type="button"
        variant="link"
        onClick={() => handleStartOver(UI_STEPS.FORGOT_EMAIL)}
        disabled={loading}
        className="text-gray-400 hover:text-gray-600 w-full mt-2"
      >
        Change Email
      </Button>
    </form>
  );

  // ✅ Forgot Password: Set New Password (STEP 5)
  const renderSetNewPassword = () => (
    <form onSubmit={handleSetNewPassword} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 text-center">Set New Password</h3>
      <p className="text-sm text-center text-gray-600">
        Enter your new password for <strong>{email}</strong>
      </p>

      <div>
        <Label htmlFor="new-password" className="font-semibold">New Password</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={newPasswordVisible ? "text" : "password"} // Dynamic type
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4 pr-12"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setNewPasswordVisible(!newPasswordVisible)} // Toggle visibility
            className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 p-0"
            aria-label={newPasswordVisible ? "Hide password" : "Show password"}
          >
            {newPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirm-new-password" className="font-semibold">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirm-new-password"
            type={confirmNewPasswordVisible ? "text" : "password"} // Dynamic type
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-4 pr-12"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setConfirmNewPasswordVisible(!confirmNewPasswordVisible)} // Toggle visibility
            className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 p-0"
            aria-label={confirmNewPasswordVisible ? "Hide password" : "Show password"}
          >
            {confirmNewPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-lg bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916]
          text-white font-semibold"
        disabled={loading}
      >
        {loading ? "Setting Password..." : "Reset Password & Login"}
      </Button>
    </form>
  );


  // ------------------------------------------------------------------
  // --- MAIN RENDER LOGIC --------------------------------------------
  // ------------------------------------------------------------------

  const renderContent = () => {
    switch (step) {
      case UI_STEPS.SIGN_IN:
        return renderSignInForm();
      case UI_STEPS.SIGN_IN_OTP:
        return renderOtpVerification();
      case UI_STEPS.FORGOT_EMAIL:
        return renderForgotPasswordEmail();
      case UI_STEPS.FORGOT_OTP:
        return renderForgotPasswordOtp();
      case UI_STEPS.SET_NEW_PASSWORD:
        return renderSetNewPassword();
      default:
        return renderSignInForm();
    }
  };

  const getCardTitle = () => {
    switch (step) {
      case UI_STEPS.SIGN_IN:
      case UI_STEPS.SIGN_IN_OTP:
        return "Login to Account";
      case UI_STEPS.FORGOT_EMAIL:
      case UI_STEPS.FORGOT_OTP:
      case UI_STEPS.SET_NEW_PASSWORD:
        return "Password Recovery";
      default:
        return "User Information";
    }
  };


  // ✅ UI (with floating card layout)
  return (
    <div className="flex items-center justify-center p-4">
      {/* Mobile View */}
      <div className="flex md:hidden w-full flex-col items-center justify-center">
        <Card className="bg-white rounded-3xl p-8 shadow-xl border-0 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{getCardTitle()}</h2>
          {renderContent()}
          {(step === UI_STEPS.SIGN_IN || step === UI_STEPS.FORGOT_EMAIL) && (
            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <button onClick={onSwitchToSignUp} className="text-[#7C2A25] font-semibold hover:underline">
                Sign up
              </button>
            </p>
          )}
        </Card>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center relative h-[60vh]" style={{ width: "1000px" }}>
        <div className="w-[1000px] mx-auto relative">
          {/* Orange Header */}
          <div className="w-full bg-gradient-to-br from-[#8C2E2B] via-[#66201D] to-[#1A0B0A] rounded-t-3xl p-12 text-left shadow-lg">
            <h1 className="text-5xl font-bold text-white mb-6">Welcome Back</h1>
            <p className="text-lg text-orange-50 leading-relaxed mb-12 mt-4 w-[70%]">
              Manage your profile, orders, and addresses seamlessly.
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

              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">{getCardTitle()}</h2>
              <div className="flex-grow">{renderContent()}</div>
              {(step === UI_STEPS.SIGN_IN || step === UI_STEPS.FORGOT_EMAIL) && (
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don’t have an account?{" "}
                  <button onClick={onSwitchToSignUp} className="text-[#7C2A25] font-semibold hover:underline">
                    Sign up
                  </button>
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;