"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // only added state (UI unchanged)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      console.log("REGISTER:", data);

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Account created successfully");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center px-6">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">

          <div className="text-center mb-8">
            <h1 className="text-5xl font-black tracking-wide">
              <span style={{ color: "cyan" }}>Freelance</span>
              <span className="text-white">X</span>
            </h1>

            <p className="text-gray-400 mt-4">
              Create your account and start your journey
            </p>
          </div>

          {/* ONLY CHANGE: added onSubmit */}
          <form className="space-y-5" onSubmit={handleRegister}>

            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Register As
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
              >
                <option value="client">Client</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>

            {/* Terms (unchanged UI only) */}
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <input type="checkbox" className="mt-1" />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </div>

            {/* Button (unchanged) */}
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[#1424ff] hover:opacity-90 transition font-semibold"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1424ff] font-semibold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}