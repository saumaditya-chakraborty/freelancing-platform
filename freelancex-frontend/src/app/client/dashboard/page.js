"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      projectsPosted: 0,
      activeHires: 0,
      openProposals: 0,
      escrowBalance: 0,
    },
    projects: [],
    user: null,
  });

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.replace("/login");
    return;
  }

  fetchDashboard();
}, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const [projectsRes, proposalsRes] = await Promise.all([
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

      const myProjects = projects.filter(
        (project) => project.client_id === storedUser.id
      );

      const activeHires = myProjects.filter(
        (project) => project.status === "assigned"
      ).length;

      const proposalsReceived = proposals.filter((proposal) =>
        myProjects.some(
          (project) =>
            Number(project.id) === Number(proposal.project_id)
        )
      ).length;

      const totalBudget = myProjects.reduce(
        (sum, project) => sum + (project.budget || 0),
        0
      );

      setDashboardData({
        user: storedUser,
        projects: myProjects,
        stats: {
          projectsPosted: myProjects.length,
          activeHires,
          proposalsReceived,
          escrowBalance: totalBudget,
        },
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {

 localStorage.removeItem("token");
localStorage.removeItem("user");

router.replace("/login");

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
          <button
            onClick={handleLogout}
            className="
                    px-4
                    py-2
                    rounded-xl
                    bg-yellow-600
                    hover:bg-yellow-900
                    transition
                    font-normal
                  "
           >
            Log-out
          </button>

          <div className="h-11 w-11 rounded-full bg-[#1424ff] flex items-center justify-center font-bold">
            {dashboardData.user?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>
        </div>
      </nav>

      {/* Welcome */}
      <section className="relative z-10 px-8 pt-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black">
            Welcome Back, {dashboardData.user?.name || "Client"}
          </h2>

          <p className="mt-4 text-gray-300 text-lg">
            Manage projects, freelancers, milestones and payments from one dashboard.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-8 mt-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">Projects Posted</h3>
            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats.projectsPosted}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">Active Hires</h3>
            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats.activeHires}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">Proposals Received</h3>
            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              {dashboardData.stats.proposalsReceived}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-gray-400">Total Budget</h3>
            <p className="text-5xl font-black mt-3 text-[#1424ff]">
              ₹{dashboardData.stats.escrowBalance}
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
              href="/client/post-project"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                Post Project
              </h3>

              <p className="mt-3 text-gray-400">
                Create a new project
              </p>
            </Link>

            <Link
              href="/client/projects"
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
            >
              <h3 className="text-xl font-bold">
                My Projects
              </h3>

              <p className="mt-3 text-gray-400">
                Manage your projects
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
                Release milestone payments
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
                Chat with freelancers
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-10 px-8 py-14">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-black mb-8">
            My Projects
          </h2>

          <div className="space-y-5">

            {dashboardData.projects.length > 0 ? (
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
                        {project.description}
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

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-gray-500">
        © 2026 FreelanceX
      </footer>
    </main>
  );
}