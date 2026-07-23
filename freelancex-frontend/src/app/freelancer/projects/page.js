"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FreelancerProjectsPage() {

    const router = useRouter();

    // ==========================
    // STATES
    // ==========================

    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    // ==========================
    // FETCH PROJECTS
    // ==========================

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                "http://localhost:8080/projects",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Unable to fetch projects");
            }

            const data = await res.json();
            console.log("PROJECTS:", data);

            setProjects(data);
            setFilteredProjects(data);

        } catch (err) {

            console.error(err);
            setError("Unable to load projects.");

        } finally {

            setLoading(false);

        }

    }

    // ==========================
    // SEARCH
    // ==========================

    useEffect(() => {

        if (search.trim() === "") {
            setFilteredProjects(projects);
            return;
        }

            const filtered = projects.filter((project) =>

    project.title
        ?.toLowerCase()
        .includes(search.toLowerCase())

    ||

    project.description
        ?.toLowerCase()
        .includes(search.toLowerCase())

    ||

    project.skills_required
        ?.toLowerCase()
        .includes(search.toLowerCase())

);

        setFilteredProjects(filtered);

    }, [search, projects]);

    // ==========================
    // SUBMIT PROPOSAL
    // ==========================

    function submitProposal(projectID) {
        router.push(`/freelancer/projects/${projectID}/proposal`);
    }

    // ==========================
    // STATUS BADGE
    // ==========================

    function statusBadge(status) {

        const currentStatus = (status || "").toLowerCase();

        switch (currentStatus) {

            case "open":
                return (
                    <span className="px-4 py-1 rounded-full bg-green-500/20 border border-green-500 text-green-400 text-sm font-semibold">
                        Open
                    </span>
                );

            case "under_review":
                return (
                    <span className="px-4 py-1 rounded-full bg-blue-500/20 border border-blue-500 text-blue-400 text-sm font-semibold">
                        Under Review
                    </span>
                );

            case "assigned":
                return (
                    <span className="px-4 py-1 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-400 text-sm font-semibold">
                        Assigned
                    </span>
                );

            case "in_progress":
                return (
                    <span className="px-4 py-1 rounded-full bg-purple-500/20 border border-purple-500 text-purple-400 text-sm font-semibold">
                        In Progress
                    </span>
                );

            case "completed":
                return (
                    <span className="px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-sm font-semibold">
                        Completed
                    </span>
                );

            case "cancelled":
                return (
                    <span className="px-4 py-1 rounded-full bg-red-500/20 border border-red-500 text-red-400 text-sm font-semibold">
                        Cancelled
                    </span>
                );

            default:
                return (
                    <span className="px-4 py-1 rounded-full bg-gray-500/20 border border-gray-500 text-gray-300 text-sm font-semibold">
                        {status || "Unknown"}
                    </span>
                );

        }

    }

    // ==========================
    // UI
    // ==========================

    return (

        <main className="min-h-screen bg-black text-white overflow-hidden">

            {/* Background */}

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">

                       {/* ==========================
                    HEADER
                ========================== */}

                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-10">

                    <div>

                        <h1 className="text-5xl font-black tracking-wide">

                            Projects

                        </h1>

                        <p className="text-gray-400 mt-3 text-lg">

                            Browse available projects and submit proposals to clients.

                        </p>

                    </div>

                    <button
                        onClick={() => router.push("/freelancer/dashboard")}
                        className="bg-white/10 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold backdrop-blur-lg"
                    >
                        ← Dashboard
                    </button>

                </div>

                {/* ==========================
                    SEARCH BAR
                ========================== */}

                <div className="mb-10">

                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-white placeholder-gray-500 outline-none backdrop-blur-lg focus:border-blue-500 transition"
                    />

                </div>

                {/* ==========================
                    LOADING
                ========================== */}

                {loading && (

                    <div className="flex justify-center py-24">

                        <div className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

                    </div>

                )}

                {/* ==========================
                    ERROR
                ========================== */}

                {!loading && error && (

                    <div className="rounded-3xl border border-red-500 bg-red-500/10 p-10 text-center">

                        <h2 className="text-2xl font-bold text-red-400 mb-3">

                            Unable to Load Projects

                        </h2>

                        <p className="text-gray-300">

                            {error}

                        </p>

                    </div>

                )}

                {/* ==========================
                    EMPTY STATE
                ========================== */}

                {!loading &&
                    !error &&
                    filteredProjects.length === 0 && (

                        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-16 text-center">

                            <div className="text-7xl mb-6">

                                📂

                            </div>

                            <h2 className="text-3xl font-bold mb-4">

                                No Projects Found

                            </h2>

                            <p className="text-gray-400">

                                Try searching with a different keyword.

                            </p>

                        </div>

                )}

                {/* ==========================
                    PROJECT GRID
                ========================== */}

                {!loading &&
                    !error &&
                    filteredProjects.length > 0 && (

                    <div className="grid lg:grid-cols-2 gap-8">
                                                {filteredProjects.map((project) => {

                            const currentStatus = (project.status || "").toLowerCase();

                            const canSubmit =
                                currentStatus === "open" ||
                                currentStatus === "under_review";

                            return (

                                <div
                                    key={project.id}
                                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
                                >

                                    {/* Project Title */}

                                    <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition">

                                        {project.title}

                                    </h2>

                                    {/* Description */}

                                    <p className="text-gray-400 leading-7 min-h-[90px]">

                                        {project.description}

                                    </p>
                                    {/* Required Skills */}

                                                <div className="mt-5">

                                                    <p className="text-sm text-gray-500">
                                                        Required Skills
                                                    </p>

                                                    <p className="text-cyan-400 font-medium mt-1">
                                                        {project.skills_required || "Not specified"}
                                                    </p>

                                                </div>

                                    {/* Divider */}

                                    <div className="border-t border-white/10 my-8"></div>

                                    {/* Budget */}

                                    <div className="flex justify-between items-center mb-5">

                                        <span className="text-gray-400">

                                            Budget

                                        </span>

                                        <span className="text-3xl font-black text-green-400">

                                            ₹{project.budget}

                                        </span>

                                    </div>

                                    {/* Status */}

                                    <div className="flex justify-between items-center mb-10">

                                        <span className="text-gray-400">

                                            Status

                                        </span>

                                        {statusBadge(project.status)}

                                    </div>

                                    {/* Submit Proposal */}

                                    {canSubmit ? (

                                        <button
                                            onClick={() => submitProposal(project.id)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 rounded-2xl py-3 font-semibold transition-all duration-300"
                                        >

                                            Submit Proposal

                                        </button>

                                    ) : (

                                        <button
                                            disabled
                                            className="w-full bg-gray-700 text-gray-400 rounded-2xl py-3 cursor-not-allowed font-semibold"
                                        >

                                            Not Accepting Proposals

                                        </button>

                                    )}

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </main>

    );

}