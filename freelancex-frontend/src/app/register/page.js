"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center px-6">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
           <h1 className="text-5xl font-black tracking-wide">
  <span
    style={{
      color: "cyan",
    }}
  >
    Freelance
  </span>

  <span
    className="text-white"
  >
    X
  </span>
</h1>

            <p className="text-gray-400 mt-4">
              Create your account and start your journey
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
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
                className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Register As
              </label>

              <select
                className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
              >
                <option value="client">Client</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <input type="checkbox" className="mt-1" />

              <span>
                I agree to the Terms of Service and Privacy Policy
              </span>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[#1424ff] hover:opacity-90 transition font-semibold"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10"></div>

           

            <div className="flex-1 h-px bg-white/10"></div>
          </div>


          {/* Login Link */}
          <p className="text-center text-gray-400 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#1424ff] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}