import React, { useState } from "react";
import { CheckSquare, Eye, EyeOff } from "lucide-react";

export default function LoginScreen({ onLogin, onSwitch }) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("maya@studio.co");
  const [pass, setPass] = useState("••••••••");

  return (
    <div className="min-h-screen flex w-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="hidden lg:flex w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/8 translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10 text-center">
          <div className="w-32 h-32 mx-auto mb-8">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="rgba(255,255,255,0.12)" />
              <rect x="55" y="65" width="90" height="12" rx="6" fill="white" opacity="0.9" />
              <rect x="55" y="87" width="70" height="12" rx="6" fill="white" opacity="0.6" />
              <rect x="55" y="109" width="80" height="12" rx="6" fill="white" opacity="0.6" />
              <rect x="55" y="131" width="55" height="12" rx="6" fill="white" opacity="0.4" />
              <circle cx="40" cy="71" r="7" fill="white" opacity="0.9" />
              <circle cx="40" cy="93" r="7" fill="white" opacity="0.6" />
              <circle cx="40" cy="115" r="7" fill="white" opacity="0.6" />
              <circle cx="40" cy="137" r="7" fill="white" opacity="0.4" />
              <path d="M37 71 L40 74 L45 68" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-white text-3xl font-extrabold leading-tight mb-3">Stay on top of<br />everything.</h1>
          <p className="text-white/70 text-base max-w-xs mx-auto">Your tasks, your schedule, your way. Organized and always within reach.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center mb-6">
              <CheckSquare size={20} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground text-left">Welcome back</h2>
            <p className="text-muted-foreground text-sm mt-1 text-left">Sign in to your account to continue</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Email address</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  placeholder="••••••••"
                />
                <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded accent-primary" defaultChecked /> Remember me
              </label>
              <button className="text-sm text-primary font-semibold hover:underline">Forgot password?</button>
            </div>
            <button
              onClick={onLogin}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-primary/25"
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {"Don't have an account? "}
            <button onClick={onSwitch} className="text-primary font-bold hover:underline">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
