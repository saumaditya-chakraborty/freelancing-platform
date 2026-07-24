"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/services/adminService";

export default function AdminLogin() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function login() {

        try {

            setLoading(true);

            const data = await adminLogin(email, password);

            if (data.user.role !== "admin") {
                alert("Access Denied");
                return;
            }

            router.push("/admin/dashboard");

        } catch (err) {

            alert(err.message);

        } finally {
            setLoading(false);
        }

    }

    return (

        <div className="min-h-screen bg-black text-white flex justify-center items-center overflow-hidden">

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#4b0000_0%,#160000_30%,#090909_70%,#000_100%)]" />

            <div className="relative z-10 w-[430px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-2xl">

                <div className="flex flex-col items-center">

                    <div className="w-20 h-20 rounded-full bg-red-700/30 flex items-center justify-center">

                       

                    </div>

                    <h1 className="mt-6 text-4xl font-black">
                        FreelanceX
                    </h1>

                    <p className="text-red-400 font-semibold">
                        Administration Panel
                    </p>

                </div>

                <input

                    className="w-full mt-10 bg-black/40 border border-white/10 rounded-xl px-4 py-4"

                    placeholder="Admin Email"

                    value={email}

                    onChange={e => setEmail(e.target.value)}

                />

                <input

                    type="password"

                    className="w-full mt-5 bg-black/40 border border-white/10 rounded-xl px-4 py-4"

                    placeholder="Password"

                    value={password}

                    onChange={e => setPassword(e.target.value)}

                />

                <button

                    onClick={login}

                    className="w-full mt-8 bg-red-700 hover:bg-red-800 transition rounded-xl py-4 font-bold"

                >

                    {loading ? "Signing In..." : "Sign In"}

                </button>

            </div>

        </div>

    );

}