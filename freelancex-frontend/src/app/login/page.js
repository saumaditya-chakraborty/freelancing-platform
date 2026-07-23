"use client";


import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
 const router = useRouter();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) return;

    const userString = localStorage.getItem("user");

    if (!userString || userString === "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return;
    }

    let user;

    try {
        user = JSON.parse(userString);
    } catch (err) {
        console.error("Invalid user JSON", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return;
    }

    if (user.role === "client") {
        router.replace("/client/dashboard");
    } else if (user.role === "freelancer") {
        router.replace("/freelancer/dashboard");
    } else if (user.role === "admin") {
        router.replace("/admin/dashboard");
    }

}, [router]);
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    console.log("Trying login...");

    const data = await login(email, password);

    console.log("Backend Response:", data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

console.log("Saved User:", data.user);


if (data.user.role === "client") {
    router.replace("/client/dashboard");
} else if (data.user.role === "freelancer") {
    router.replace("/freelancer/dashboard");
} else if (data.user.role === "admin") {
    router.replace("/admin/dashboard");
}

   
  } catch (error) {
  console.error(error);
  alert("Login Failed");
}
};

const handleGoogleLogin = async (credentialResponse) => {
  try {
    const payload = JSON.parse(
      atob(credentialResponse.credential.split(".")[1])
    );

    const res = await fetch(
      "http://localhost:8080/auth/google",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: payload.email,
          name: payload.name,
        }),
      }
    );

    const data = await res.json();

    console.log("Backend:", data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    router.replace("/client/dashboard");
  } catch (err) {
    console.error(err);
  }
};
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center px-6">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* Login Card */}
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
              Welcome back to your workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit = {handleLogin}className="space-y-5">

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
            className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
            />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
              />
            </div>

            

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1424ff] hover:opacity-90 transition font-semibold"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-500 text-sm">
              
            </span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google Login */}
<div className="flex justify-center mb-6">
  <GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={() => {
      console.log("Google Login Failed");
    }}
  />
</div>

        

          {/* Register */}
          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[#1424ff] font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}