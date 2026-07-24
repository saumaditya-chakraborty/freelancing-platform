"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboard } from "@/services/adminService";

export default function AdminDashboard() {

    const router = useRouter();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/admin/login");
            return;
        }

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const data = await getDashboard();
            setStats(data);

        } catch (err) {

            console.log(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                router.replace("/admin/login");
            }

        } finally {

            setLoading(false);

        }
    }

    function logout() {
        localStorage.removeItem("token");
        router.replace("/admin/login");
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
                Loading Dashboard...
            </main>
        );
    }

    const cards = [
        { title: "Users", value: stats?.total_users ?? 0 },
        { title: "Clients", value: stats?.total_clients ?? 0 },
        { title: "Freelancers", value: stats?.total_freelancers ?? 0 },
        { title: "Projects", value: stats?.total_projects ?? 0 },
        { title: "Proposals", value: stats?.total_proposals ?? 0 },
        { title: "Payments", value: stats?.total_payments ?? 0 },
        { title: "Reviews", value: stats?.total_reviews ?? 0 },
        { title: "Blocked Users", value: stats?.blocked_users ?? 0 },
        { title: "Banned Users", value: stats?.banned_users ?? 0 },
    ];

    return (
        <main className="min-h-screen bg-black text-white">

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#500000_0%,#180000_35%,#050505_70%,#000000_100%)]" />

            <div className="relative z-10 p-10">

                <div className="flex justify-between items-center mb-10">

                    <div>
                        <h1 className="text-5xl font-black">
                            Admin Dashboard
                        </h1>

                        <p className="text-gray-400 mt-2">
                            FreelanceX Administration Panel
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-xl"
                    >
                        Logout
                    </button>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {cards.map((card) => (

                        <div
                            key={card.title}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                        >

                            <h2 className="text-gray-400 text-lg">
                                {card.title}
                            </h2>

                            <p className="text-5xl font-bold mt-4">
                                {card.value}
                            </p>

                        </div>

                    ))}

                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-10">

                    <button
                        onClick={() => router.push("/admin/users")}
                        className="bg-blue-700 hover:bg-blue-800 rounded-2xl p-6 text-xl font-bold"
                    >
                        👥 Manage Users
                    </button>

                    <button
                        onClick={() => router.push("/admin/projects")}
                        className="bg-green-700 hover:bg-green-800 rounded-2xl p-6 text-xl font-bold"
                    >
                        📁 Manage Projects
                    </button>

                    <button
                        onClick={() => router.push("/admin/proposals")}
                        className="bg-purple-700 hover:bg-purple-800 rounded-2xl p-6 text-xl font-bold"
                    >
                        📄 Manage Proposals
                    </button>

                </div>

            </div>

        </main>
    );
}