"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Mail, User, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-dark)] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full filter blur-[128px] opacity-[0.07]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600 rounded-full filter blur-[128px] opacity-[0.05]" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-600 rounded-full filter blur-[128px] opacity-[0.04]" />
      </div>

      {/* Top nav */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
            Documentation
          </a>
          <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
            Support
          </a>
        </div>
      </nav>

      {/* Signup card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md animate-fade-in-up">
          <div
            className="glass-card p-8 text-center"
            style={{ background: "rgba(26, 29, 39, 0.85)", backdropFilter: "blur(20px)" }}
          >
            {/* Logo */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-5 shadow-lg shadow-[var(--color-primary)]/20">
              <Eye className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400 text-sm mb-8">
              Join EngLens to get visibility into
              <br />
              your engineering team
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {error}
              </div>
            )}

            {/* Signup form */}
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1d27] border border-[var(--color-border)] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="Work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1d27] border border-[var(--color-border)] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1d27] border border-[var(--color-border)] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-sm text-slate-400 mt-6">
              Already have an account?{" "}
              <Link href="/" className="text-[var(--color-primary)] hover:underline font-medium">
                Sign in
              </Link>
            </p>

            <p className="text-[11px] text-slate-500 mt-4">
              By signing up, you agree to our{" "}
              <a href="#" className="text-[var(--color-primary)] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[var(--color-primary)] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-slate-600">
        © 2026 EngLens Inc.
      </footer>
    </div>
  );
}
