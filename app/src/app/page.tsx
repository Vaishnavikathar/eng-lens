"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Github, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
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
      <nav className="relative z-10 flex justify-end items-center px-8 py-4 gap-6">
        <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
          Documentation
        </a>
        <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
          Support
        </a>
      </nav>

      {/* Login card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="glass-card p-8 text-center" style={{ background: "rgba(26, 29, 39, 0.85)", backdropFilter: "blur(20px)" }}>
            {/* Logo */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-5 shadow-lg shadow-[var(--color-primary)]/20">
              <Eye className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">EngLens</h1>
            <p className="text-slate-400 text-sm mb-8">
              See what&apos;s really happening in your
              <br />
              engineering team
            </p>

            {/* OAuth buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#1a1d27] border border-[var(--color-border)] text-white font-medium text-sm hover:bg-[var(--color-bg-card-hover)] hover:border-[rgba(164,19,236,0.25)] transition-all"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white text-gray-800 font-medium text-sm hover:bg-gray-100 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            {/* Email form */}
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                placeholder="Work email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1d27] border border-[var(--color-border)] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20"
              >
                <span className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Continue with Email
                </span>
              </button>
            </form>

            <p className="text-[11px] text-slate-500 mt-6">
              By signing in, you agree to our{" "}
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
        © 2025 EngLens Inc.
      </footer>
    </div>
  );
}
