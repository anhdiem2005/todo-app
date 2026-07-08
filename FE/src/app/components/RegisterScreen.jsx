import React, { useState } from "react";
import { CheckSquare, Eye, EyeOff, Loader2 } from "lucide-react";
import { register, saveSession } from "../services/authService";

export default function RegisterScreen({ onRegister, onSwitch }) {
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (pass.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const data = await register({ name, email, password: pass });
      saveSession(data);
      onRegister(data);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <div className="relative z-10 text-center">
          <div className="w-32 h-32 mx-auto mb-8">
            <svg viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" fill="rgba(255,255,255,0.12)" />
              <circle cx="80" cy="85" r="22" fill="white" opacity="0.85" />
              <path d="M50 145 Q80 120 110 145" stroke="white" strokeWidth="14" strokeLinecap="round" opacity="0.85" />
              <circle cx="130" cy="85" r="15" fill="white" opacity="0.5" />
              <path d="M115 140 Q130 128 145 140" stroke="white" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
              <circle cx="160" cy="65" r="10" fill="white" opacity="0.3" />
            </svg>
          </div>
          <h1 className="text-white text-3xl font-extrabold leading-tight mb-3">Join the<br />productive side.</h1>
          <p className="text-white/70 text-base max-w-xs mx-auto">Build habits that stick. Track progress with clarity.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-background px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center mb-6">
              <CheckSquare size={20} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground text-left">Create account</h2>
            <p className="text-muted-foreground text-sm mt-1 text-left">Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Full name</label>
              <input
                id="register-name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Maya Reyes"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Email address</label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account...</>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button onClick={onSwitch} className="text-primary font-bold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}
