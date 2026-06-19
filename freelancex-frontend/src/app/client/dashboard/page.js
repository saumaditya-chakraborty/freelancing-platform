"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      projectsPosted: 0,
      activeHires: 0,
      openProposals: 0,
      escrowBalance: 0,
    },
    projects: [],
    user: {},
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/client/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-black tracking-wide">
          Freelance
          <span
            className="text-[#1424ff]"
            style={{
              textShadow: "0 0 12px #1424ff",
            }}
          >
            X
          </span>
        </h1>

        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition">
            Notifications
          </button>

          <div className="h-11 w-11 rounded-full bg-[#1424ff] flex items-center justify-center font-bold">
            {dashboardData.user?.name?.charAt(0) || "C"}
          </div>
        </div>
      </nav>

      {/* Welcome */}
      <section className="relative z-10 px-8 pt-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black">
            Welcome Back, {dashboardData.user?.name || "Client"} 👋
          </h2>

          <p className="mt-4 text-gray-300 text-lg">
            Manage projects, freelancers, milestones and payments from one
            dashboard.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-8 mt-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">Projects Posted</h3>
            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats?.projectsPosted ?? 0}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">Active Hires</h3>
            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats?.activeHires ?? 0}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">Open Proposals</h3>
            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats?.openProposals ?? 0}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">Escrow Balance</h3>
            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              ₹{dashboardData.stats?.escrowBalance ?? 0}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative z-10 px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-8">
            Quick Actions
          </h2>

          <div className="grid grid-cols-4 gap-6">
            <Link
              href="/client/post-project"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                Post Project
              </h3>

              <p className="mt-3 text-gray-400">
                Create a new project.
              </p>
            </Link>

            <Link
              href="/client/projects"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                Projects
              </h3>

              <p className="mt-3 text-gray-400">
                Manage all projects.
              </p>
            </Link>

            <Link
              href="/client/payments"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                Payments
              </h3>

              <p className="mt-3 text-gray-400">
                Release milestones.
              </p>
            </Link>

            <Link
              href="/client/messages"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                Messages
              </h3>

              <p className="mt-3 text-gray-400">
                Chat with freelancers.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="relative z-10 px-8 py-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-8">
            Recent Projects
          </h2>

          <div className="space-y-5">
            {dashboardData.projects?.length > 0 ? (
              dashboardData.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">
                        {project.title}
                      </h3>

                      <p className="text-gray-400">
                        {project.techStack || project.description}
                      </p>
                    </div>

                    <span className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400">
                      {project.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
                No projects found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-gray-500">
        © 2026 FreelanceX
      </footer>
    </main>
  );
}