"use client";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function AuthForm({ onAuth }: { onAuth?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let result;
    if (mode === "signIn") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (onAuth) onAuth();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "signIn" ? "Sign In" : "Sign Up"}
        </h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (mode === "signIn" ? "Signing In..." : "Signing Up...") : (mode === "signIn" ? "Sign In" : "Sign Up")}
        </button>
        <div className="mt-4 text-center">
          {mode === "signIn" ? (
            <span>
              Don&apos;t have an account?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => setMode("signUp")}>Sign Up</button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => setMode("signIn")}>Sign In</button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
} 