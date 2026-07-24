"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  getProjectTime,
  getTimeLogs,
} from "@/services/timeTrackingService";

export default function TimeTracker() {
  const router = useRouter();
  const params = useParams();

  // Route Project ID
  const projectId = Number(params.projectId);
  console.log("params =", params);
console.log("projectId =", projectId);

  // -----------------------------
  // State
  // -----------------------------

  const [loading, setLoading] = useState(true);

  const [project, setProject] = useState(null);

  const [tracking, setTracking] = useState(null);

  const [logs, setLogs] = useState([]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [liveSeconds, setLiveSeconds] = useState(0);

  // -----------------------------
  // Fetch Project
  // -----------------------------

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to fetch project.");
      }

      const data = await response.json();

      setProject(data);

    } catch (error) {
      console.error("Project Error:", error);
    }
  };

  // -----------------------------
  // Fetch Tracker
  // -----------------------------

  const fetchTracker = async () => {
    try {

      const response = await getProjectTime(projectId);

      if (response.data.tracking) {

        setTracking(response.data.tracking);

        setElapsedSeconds(
          response.data.tracking.total_seconds || 0
        );

      } else {

        setTracking(null);

        setElapsedSeconds(0);

      }

    } catch (error) {

      console.error("Tracker Error:", error);

    }
  };

  // -----------------------------
  // Fetch Logs
  // -----------------------------

  const fetchLogs = async () => {
    try {

      const response = await getTimeLogs(projectId);

      setLogs(response.data.logs || []);

    } catch (error) {

      console.error("Logs Error:", error);

    }
  };

  // -----------------------------
  // Initial Load
  // -----------------------------

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!projectId || Number.isNaN(projectId)) {
      console.error("Invalid Project ID");
      return;
    }

    async function loadPage() {
  setLoading(true);

  try {
    await Promise.all([
      fetchProject(),
      fetchTracker(),
      fetchLogs(),
    ]);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

    loadPage();

  }, [projectId]);

  // -----------------------------
  // Live Timer
  // -----------------------------

  useEffect(() => {

    let interval = null;

    if (tracking?.status === "running") {

      interval = setInterval(() => {

        setLiveSeconds((prev) => prev + 1);

      }, 1000);

    } else {

      setLiveSeconds(0);

    }

    return () => {

      if (interval) clearInterval(interval);

    };

  }, [tracking]);

  // -----------------------------
  // Helpers
  // -----------------------------

  const formatTime = (seconds) => {

    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const formatDate = (date) => {

    if (!date || date.startsWith("0001-01-01")) {
      return "Running";
    }

    return new Date(date).toLocaleString();

  };

  // -----------------------------
  // Button Actions
  // -----------------------------

  const handleStart = async () => {

    try {

      await startTimer(projectId);

      await fetchTracker();

      await fetchLogs();

    } catch (err) {

      alert(err.response?.data?.error || "Unable to start timer.");

    }
  };

  const handlePause = async () => {

    if (!tracking) return;

    try {

      await pauseTimer(tracking.id);

      await fetchTracker();

      await fetchLogs();

    } catch (err) {

      alert(err.response?.data?.error || "Unable to pause timer.");

    }
  };

  const handleResume = async () => {

    if (!tracking) return;

    try {

      await resumeTimer(tracking.id);

      await fetchTracker();

      await fetchLogs();

    } catch (err) {

      alert(err.response?.data?.error || "Unable to resume timer.");

    }
  };

  const handleStop = async () => {

    if (!tracking) return;

    try {

      await stopTimer(tracking.id);

      await fetchTracker();

      await fetchLogs();

    } catch (err) {

      alert(err.response?.data?.error || "Unable to stop timer.");

    }
  };

  if (loading) {

    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading Time Tracker...
      </main>
    );

  }
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Background */}

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* ================= NAVBAR ================= */}

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">

        <Link href="/freelancer/dashboard">
          <h1 className="text-5xl font-black tracking-wide cursor-pointer">
            <span className="text-cyan-400">Freelance</span>
            <span className="text-white">X</span>
          </h1>
        </Link>

        <div className="flex items-center gap-4">

          <button
            onClick={() => router.push("/freelancer/dashboard")}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/freelancer/messages")}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Messages
          </button>

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="relative z-10 px-8 pt-10">

        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => router.back()}
            className="mb-8 text-cyan-400 hover:text-cyan-300 transition font-semibold"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-10">

            <div className="flex flex-col lg:flex-row justify-between gap-10">

              <div className="flex-1">

                <h1 className="text-5xl font-black">

                  {project?.title || "Untitled Project"}

                </h1>

                <p className="mt-5 text-gray-400 text-lg">

                  {project?.description || "No description available."}

                </p>

              </div>

              <div className="flex flex-col items-center justify-center">

                <span
                  className={`px-6 py-3 rounded-full text-lg font-bold
                  ${
                    tracking?.status === "running"
                      ? "bg-green-500/20 text-green-400"
                      : tracking?.status === "paused"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : tracking?.status === "completed"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-600/20 text-gray-300"
                  }`}
                >

                  {tracking?.status || "Not Started"}

                </span>

                <span className="text-gray-400 mt-5">

                  Project Budget

                </span>

                <span className="text-4xl font-black text-cyan-400 mt-2">

                  ₹{project?.budget || 0}

                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= LIVE TIMER ================= */}

      <section className="relative z-10 px-8 mt-12">

        <div className="max-w-5xl mx-auto">

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-14 text-center">

            <h2 className="text-2xl text-gray-400 mb-10">

              Live Work Timer

            </h2>

            <div
              className={`text-8xl lg:text-9xl font-black tracking-widest transition-all duration-300
              ${
                tracking?.status === "running"
                  ? "text-cyan-400 animate-pulse"
                  : "text-white"
              }`}
            >

              {formatTime(elapsedSeconds + liveSeconds)}

            </div>

            <p className="mt-8 text-gray-400 text-xl">

              Total Time Worked

            </p>

          </div>

        </div>

      </section>

      {/* ================= ACTION BUTTONS ================= */}

      <section className="relative z-10 px-8 mt-12">

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

          <button
            onClick={handleStart}
            disabled={tracking?.status === "running"}
            className="py-4 rounded-2xl bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition font-bold text-lg"
          >
            ▶ Start
          </button>

          <button
            onClick={handlePause}
            disabled={tracking?.status !== "running"}
            className="py-4 rounded-2xl bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition font-bold text-lg"
          >
            ⏸ Pause
          </button>

          <button
            onClick={handleResume}
            disabled={tracking?.status !== "paused"}
            className="py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition font-bold text-lg"
          >
            ▶ Resume
          </button>

          <button
            onClick={handleStop}
            disabled={!tracking || tracking.status === "completed"}
            className="py-4 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition font-bold text-lg"
          >
            ■ Stop
          </button>

        </div>

      </section>

      {/* ================= STATISTICS ================= */}

      <section className="relative z-10 px-8 mt-12">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8">

            <p className="text-gray-400">
              Status
            </p>

            <h2 className="text-4xl font-black mt-4 text-cyan-400">
              {tracking?.status || "New"}
            </h2>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8">

            <p className="text-gray-400">
              Total Time
            </p>

            <h2 className="text-4xl font-black mt-4 text-cyan-400">
              {formatTime(elapsedSeconds)}
            </h2>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8">

            <p className="text-gray-400">
              Sessions
            </p>

            <h2 className="text-4xl font-black mt-4 text-cyan-400">
              {logs.length}
            </h2>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8">

            <p className="text-gray-400">
              Project ID
            </p>

            <h2 className="text-4xl font-black mt-4 text-cyan-400">
              #{projectId}
            </h2>

          </div>

        </div>

      </section>


            {/* ================= WORK SESSION HISTORY ================= */}

      <section className="relative z-10 px-8 py-14">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-black mb-8">
            Work Session History
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">

            {logs.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-white/10">

                    <tr>

                      <th className="text-left px-6 py-5">#</th>

                      <th className="text-left px-6 py-5">
                        Start Time
                      </th>

                      <th className="text-left px-6 py-5">
                        End Time
                      </th>

                      <th className="text-left px-6 py-5">
                        Duration
                      </th>

                      <th className="text-left px-6 py-5">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {logs.map((log, index) => {

                      const running =
                        !log.end_time ||
                        log.end_time.startsWith("0001-01-01");

                      return (

                        <tr
                          key={log.id}
                          className="border-t border-white/10 hover:bg-white/5 transition"
                        >

                          <td className="px-6 py-5">
                            {index + 1}
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {formatDate(log.start_time)}
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {running
                              ? "Running..."
                              : formatDate(log.end_time)}
                          </td>

                          <td className="px-6 py-5">

                            <span className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 font-semibold">

                              {formatTime(log.duration_seconds)}

                            </span>

                          </td>

                          <td className="px-6 py-5">

                            {running ? (

                              <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400">

                                Running

                              </span>

                            ) : (

                              <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400">

                                Completed

                              </span>

                            )}

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="flex flex-col items-center justify-center py-24">

                <div className="text-8xl mb-6">
                  ⏱
                </div>

                <h2 className="text-3xl font-bold">
                  No Work Sessions Yet
                </h2>

                <p className="text-gray-400 mt-4 text-lg">

                  Press the

                  <span className="text-green-400 font-semibold">
                    {" "}Start{" "}
                  </span>

                  button to begin tracking your work.

                </p>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="relative z-10 border-t border-white/10 py-8">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">

        

          <div className="text-gray-500 mt-6 md:mt-0">

            © 2026 FreelanceX. All Rights Reserved.

          </div>

        </div>

      </footer>

    </main>

  );
}
  
