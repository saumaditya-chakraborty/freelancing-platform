"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      activeProjects: 0,
      submittedBids: 0,
      completedProjects: 0,
      totalEarnings: 0,
    },
    projects: [],
    proposals: [],
    user: null,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const [projectsRes, proposalsRes] =
        await Promise.all([
          fetch("http://localhost:8080/projects", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:8080/proposals", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const projects = await projectsRes.json();
      const proposals = await proposalsRes.json();

      const myProposals = proposals.filter(
  (proposal) =>
    proposal.FreelancerID === storedUser.id
);
      const activeProjects = projects.filter(
        (project) =>
          project.status === "in_progress"
      );

      const completedProjects = projects.filter(
        (project) =>
          project.status === "completed"
      );

      const earnings =
        completedProjects.reduce(
          (sum, project) =>
            sum + (project.budget || 0),
          0
        );

      setDashboardData({
        user: storedUser,
        projects: activeProjects,
        proposals: myProposals,

        stats: {
          activeProjects:
            activeProjects.length,

          submittedBids:
            myProposals.length,

          completedProjects:
            completedProjects.length,

          totalEarnings: earnings,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading Dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Background */}

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* Navbar */}

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">

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

        <div className="flex gap-4 items-center">

          <button className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition">
            Notifications
          </button>

          <div className="h-11 w-11 rounded-full bg-[#1424ff] flex items-center justify-center font-bold">
            {dashboardData.user?.name
              ?.charAt(0)
              ?.toUpperCase() || "F"}
          </div>

        </div>

      </nav>

      {/* Welcome */}

      <section className="relative z-10 px-8 pt-12">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-black">
            Welcome Back,
            {" "}
            {dashboardData.user?.name ||
              "Freelancer"}
          </h2>

          <p className="mt-4 text-gray-300 text-lg">
            Manage bids, projects,
            earnings and communication.
          </p>

        </div>

      </section>

      {/* Stats */}

      <section className="relative z-10 px-8 mt-10">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">
              Active Projects
            </h3>

            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats.activeProjects}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">
              Submitted Bids
            </h3>

            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats.submittedBids}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">
              Completed Projects
            </h3>

            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats.completedProjects}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">
              Total Earnings
            </h3>

            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              ₹{dashboardData.stats.totalEarnings}
            </p>
          </div>

        </div>

      </section>

      {/* Workspace */}

      <section className="relative z-10 px-8 mt-12">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-black mb-8">
            Workspace
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            <Link
              href="/freelancer/projects"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                Browse Projects
              </h3>

              <p className="mt-3 text-gray-400">
                Find available jobs.
              </p>
            </Link>

            <Link
              href="/freelancer/bids"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                My Bids
              </h3>

              <p className="mt-3 text-gray-400">
                Track proposals.
              </p>
            </Link>

            <Link
              href="/freelancer/earnings"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                Earnings
              </h3>

              <p className="mt-3 text-gray-400">
                View payments.
              </p>
            </Link>

            <Link
              href="/freelancer/messages"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                Messages
              </h3>

              <p className="mt-3 text-gray-400">
                Chat with clients.
              </p>
            </Link>

          </div>

        </div>

      </section>

      {/* Active Projects */}

      <section className="relative z-10 px-8 py-14">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-black mb-8">
            Active Projects
          </h2>

          <div className="space-y-5">

            {dashboardData.projects.length >
            0 ? (
              dashboardData.projects.map(
                (project) => (
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
                          {
                            project.description
                          }
                        </p>

                      </div>

                      <span className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400">
                        {project.status}
                      </span>

                    </div>
                  </div>
                )
              )
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
                No active projects.
              </div>
            )}

          </div>

        </div>

      </section>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-gray-500">
        © 2026 FreelanceX 
      </footer>

    </main>
  );
}