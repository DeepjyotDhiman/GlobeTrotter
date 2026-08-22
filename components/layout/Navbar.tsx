"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Globe,
  Compass,
  Map,
  Users,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Bookmark,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Plus,
  LogIn,
  UserPlus,
  Home,
} from "lucide-react";

interface NavbarProps {
  /** Optional callback triggered when the user clicks the "Plan New Trip" button */
  onPlanTripClick?: () => void;
}

export default function Navbar({ onPlanTripClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Hydration Mount State
  const [isMounted, setIsMounted] = useState(false);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // UI State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Read Auth State from localStorage on Mount
  useEffect(() => {
    if (!isMounted) return;

    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem("globetrotter_user");
      const loggedInFlag = localStorage.getItem("globetrotter_is_logged_in") === "true";

      if (loggedInFlag && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        } catch {
          setUser({ name: "pethe om", email: "petheom05@gmail.com" });
          setIsLoggedIn(true);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, [isMounted]);

  // Compute User Initials (e.g., "pethe om" -> "PO")
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "PO";

  // Navigation Links Definition
  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Compass },
    { name: "My Trips", href: "/trips", icon: Map },
    { name: "Explore", href: "/explore", icon: Globe },
    { name: "Community", href: "/community", icon: Users },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("globetrotter_user");
    localStorage.removeItem("globetrotter_is_logged_in");
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1a17]/90 backdrop-blur-2xl border-b border-[#1d3d36] text-[#f4f1ea] shadow-2xl transition-all" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          
          {/* 1. Brand Logo & Landing Link (Left) */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href={isMounted && isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              {/* Clean Compass Travel Icon Container */}
              <div className="flex items-center justify-center w-9.5 h-9.5 rounded-2xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-600 border border-emerald-400/40 shadow-lg shadow-emerald-950/60 group-hover:scale-105 transition-transform duration-300">
                <Compass className="w-5 h-5 text-[#f4f1ea] group-hover:rotate-45 transition-transform duration-500" />
              </div>

              {/* Clean Typography: GlobeTrotter */}
              <div className="flex items-center text-xl tracking-tight font-serif">
                <span className="font-extrabold text-[#f4f1ea] group-hover:text-white transition-colors">Globe</span>
                <span className="font-medium text-emerald-400 pl-0.5 group-hover:text-emerald-300 transition-colors">Trotter</span>
              </div>
            </Link>

            {/* Subtle Home Page Link */}
            <Link
              href="/"
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#122723] hover:bg-[#183630] text-[#a8bba2] hover:text-[#f4f1ea] border border-[#22443d] text-xs font-semibold transition-all group"
              title="Return to Public Landing Page"
            >
              <Home className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Landing</span>
            </Link>

            {/* 2. Navigation Links (Center - Desktop) */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#1d3d36]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#183832] text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/20"
                        : "text-[#a8bba2] hover:text-[#f4f1ea] hover:bg-[#122723]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 3. Dynamic Action Buttons & User Menu (Right) */}
          <div className="flex items-center gap-2 sm:gap-3" suppressHydrationWarning>
            
            {!isMounted ? (
              <div className="flex items-center gap-2">
                <div className="w-20 h-8 rounded-lg bg-[#142e29] animate-pulse" />
                <div className="w-8 h-8 rounded-lg bg-[#142e29] animate-pulse" />
              </div>
            ) : isLoggedIn ? (
              /* IF LOGGED IN */
              <>
                <button
                  type="button"
                  onClick={onPlanTripClick || (() => router.push("/dashboard"))}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-[#f4f1ea] font-semibold text-xs shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition-all duration-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Plan New Trip</span>
                  <span className="sm:hidden">New Trip</span>
                </button>

                <button
                  type="button"
                  className="relative p-2 rounded-xl bg-[#122723] hover:bg-[#183630] text-[#d1e0d7] hover:text-white border border-[#22443d] transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#122723] hover:bg-[#183630] border border-[#22443d] transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {initials}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold text-[#f4f1ea] capitalize">
                      {user?.name || "pethe om"}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#a8bba2] transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f221e] border border-[#22443d] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2.5 border-b border-[#1d3d36] mb-1">
                        <p className="text-xs font-bold text-[#f4f1ea] capitalize truncate">{user?.name || "pethe om"}</p>
                        <p className="text-[11px] text-[#a8bba2] truncate">{user?.email || "petheom05@gmail.com"}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                          Explorer Pro ✨
                        </span>
                      </div>

                      <Link
                        href="/"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#d1e0d7] hover:text-white hover:bg-[#16322b] transition-colors"
                      >
                        <Home className="w-4 h-4 text-emerald-400" />
                        <span>Landing Page</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#d1e0d7] hover:text-white hover:bg-[#16322b] transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/trips"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#d1e0d7] hover:text-white hover:bg-[#16322b] transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-teal-400" />
                        <span>Saved Trips</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#d1e0d7] hover:text-white hover:bg-[#16322b] transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[#a8bba2]" />
                        <span>Account Settings</span>
                      </Link>

                      <div className="border-t border-[#1d3d36] my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* IF NOT LOGGED IN */
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#d1e0d7] hover:text-white hover:bg-white/10 backdrop-blur-md transition-all border border-white/15 hover:border-white/30 flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#122723] text-[#d1e0d7] hover:text-white border border-[#22443d] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#1d3d36] bg-[#0b1a17]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:bg-[#16322b]"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Landing Page</span>
          </Link>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#183832] text-emerald-300 border border-emerald-500/40 font-semibold"
                    : "text-[#a8bba2] hover:text-[#f4f1ea] hover:bg-[#122723]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {isMounted && !isLoggedIn && (
            <div className="pt-2 border-t border-[#1d3d36] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-lg border border-[#244b43] text-[#f4f1ea] text-xs font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
