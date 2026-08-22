"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Compass,
  MapPin,
  Plane,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface AuthScreenProps {
  initialMode?: "login" | "signup";
}

export default function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);

  // Form Field States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false,
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [serverError, setServerError] = useState("");

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear specific field error when typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError("");
  };

  // Password Strength Calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-gray-200 dark:bg-slate-700" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Good", color: "bg-cyan-500" };
      case 4:
        return { score: 100, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 15, label: "Very Weak", color: "bg-rose-500" };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Client-side Validation logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (mode === "forgot") {
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Signup specific validation
    if (mode === "signup") {
      if (!formData.name.trim()) {
        newErrors.name = "Full name is required.";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters.";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password.";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = "You must agree to the Terms & Privacy Policy.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError("");

    // Simulate API request delay
    setTimeout(() => {
      setIsLoading(false);

      if (mode === "forgot") {
        setResetSent(true);
        return;
      }

      // Mock authentication success
      setAuthSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 1200);
  };

  // Social Auth Handler
  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Floating Travel Badges (Desktop decoration) */}
      <div className="hidden lg:flex items-center gap-2 absolute top-12 left-12 px-4 py-2 rounded-full bg-white/10 dark:bg-slate-800/40 backdrop-blur-md border border-white/10 text-cyan-300 text-sm shadow-xl animate-pulse">
        <Plane className="w-4 h-4 text-cyan-400" />
        <span>Next Destination: Santorini, Greece</span>
      </div>

      <div className="hidden lg:flex items-center gap-2 absolute bottom-12 left-16 px-4 py-2 rounded-full bg-white/10 dark:bg-slate-800/40 backdrop-blur-md border border-white/10 text-emerald-300 text-sm shadow-xl">
        <Compass className="w-4 h-4 text-emerald-400" />
        <span>Over 140+ Custom Itineraries Saved</span>
      </div>

      <div className="hidden lg:flex items-center gap-2 absolute top-20 right-16 px-4 py-2 rounded-full bg-white/10 dark:bg-slate-800/40 backdrop-blur-md border border-white/10 text-amber-300 text-sm shadow-xl">
        <MapPin className="w-4 h-4 text-amber-400" />
        <span>Kyoto, Japan • Trip Plan Active</span>
      </div>

      {/* Main Auth Card Container */}
      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Glassmorphism Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-slate-800/80 shadow-2xl shadow-blue-950/50 p-6 sm:p-8 transition-all duration-300">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 mb-3 group">
              <Globe className="w-8 h-8 text-white transition-transform duration-500 group-hover:rotate-45" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              GlobeTrotter
              <Sparkles className="w-4 h-4 text-cyan-500 inline" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              {mode === "login" && "Welcome back! Access your itineraries & saved trips."}
              {mode === "signup" && "Start your next adventure with smart travel planning."}
              {mode === "forgot" && "Reset your password to get back on track."}
            </p>
          </div>

          {/* Mode Switcher Tabs (Login vs Signup) */}
          {mode !== "forgot" && (
            <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrors({});
                  setServerError("");
                }}
                className={`py-2 rounded-lg transition-all duration-200 ${
                  mode === "login"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-sm font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrors({});
                  setServerError("");
                }}
                className={`py-2 rounded-lg transition-all duration-200 ${
                  mode === "signup"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-sm font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Success Banner (Auth redirect) */}
          {authSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
              <div className="text-xs sm:text-sm">
                <p className="font-semibold">Authentication Successful!</p>
                <p className="text-emerald-600/80 dark:text-emerald-400/80">Redirecting to your Dashboard...</p>
              </div>
            </div>
          )}

          {/* Forgot Password Reset Link Sent Banner */}
          {mode === "forgot" && resetSent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-500 mx-auto flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Check your inbox</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                We sent a password reset link to <span className="font-medium text-slate-800 dark:text-slate-200">{formData.email}</span>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setResetSent(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            /* Auth Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Server/Global Error Alert */}
              {serverError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Full Name Field (Signup mode only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Morgan"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${
                        errors.name
                          ? "border-rose-500 focus:ring-rose-500"
                          : "border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                      } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex.morgan@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${
                      errors.email
                        ? "border-rose-500 focus:ring-rose-500"
                        : "border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                    } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field (Login & Signup modes) */}
              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setErrors({});
                        }}
                        className="text-xs font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${
                        errors.password
                          ? "border-rose-500 focus:ring-rose-500"
                          : "border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                      } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}

                  {/* Password Strength Indicator (Signup Mode) */}
                  {mode === "signup" && formData.password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>Strength: {passwordStrength.label}</span>
                        <span>{passwordStrength.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password Field (Signup mode only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${
                        errors.confirmPassword
                          ? "border-rose-500 focus:ring-rose-500"
                          : "border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500"
                      } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me Checkbox (Login mode) */}
              {mode === "login" && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      Keep me logged in
                    </span>
                  </label>
                </div>
              )}

              {/* Terms Checkbox (Signup mode) */}
              {mode === "signup" && (
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      I agree to the{" "}
                      <a href="#" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.agreeTerms}
                    </p>
                  )}
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading || authSuccess}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === "login" && "Sign In"}
                      {mode === "signup" && "Create Account"}
                      {mode === "forgot" && "Send Reset Link"}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Back to Login link when in Forgot Password mode */}
              {mode === "forgot" && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrors({});
                    }}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Social Logins Section (Login & Signup modes) */}
          {mode !== "forgot" && (
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase absolute">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth("Google")}
                  disabled={isLoading || authSuccess}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-sm hover:shadow"
                >
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth("Apple")}
                  disabled={isLoading || authSuccess}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-sm hover:shadow"
                >
                  <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.34c.64-.78 1.08-1.85.96-2.94-.93.04-2.06.62-2.73 1.4-.59.68-1.11 1.77-.97 2.83 1.04.08 2.1-.51 2.74-1.29z" />
                  </svg>
                  Apple
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth("GitHub")}
                  disabled={isLoading || authSuccess}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-sm hover:shadow"
                >
                  <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrors({});
                  }}
                  className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 hover:underline"
                >
                  Sign up now
                </button>
              </p>
            ) : mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrors({});
                  }}
                  className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : null}
          </div>
        </div>

        {/* Outer footer brand statement */}
        <p className="text-center text-xs text-slate-400/80 mt-4">
          © {new Date().getFullYear()} GlobeTrotter Inc. Smart Travel Planning Reimagined.
        </p>
      </div>
    </div>
  );
}
