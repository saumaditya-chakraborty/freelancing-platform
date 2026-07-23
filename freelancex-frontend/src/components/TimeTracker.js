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
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [tracking, setTracking] = useState(null);
  const [logs, setLogs] = useState([]);

  const [project, setProject] = useState(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [liveSeconds, setLiveSeconds] = useState(0);

  // -----------------------------
  // Fetch Project Details
  // -----------------------------

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      setProject(data);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Fetch Time Tracker
  // -----------------------------

  const fetchTracker = async () => {
    try {
      const response = await getProjectTime(id);

      if (response.data.tracking) {
        setTracking(response.data.tracking);

        setElapsedSeconds(
          response.data.tracking.total_seconds || 0
        );
      } else {
        setTracking(null);
        setElapsedSeconds(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Fetch Logs
  // -----------------------------

  const fetchLogs = async () => {
    try {
      const response = await getTimeLogs(id);

      setLogs(response.data.logs || []);
    } catch (err) {
      console.error(err);
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

    async function load() {
      await Promise.all([
        fetchProject(),
        fetchTracker(),
        fetchLogs(),
      ]);

      setLoading(false);
    }

    load();
  }, []);

  // -----------------------------
  // Live Timer
  // -----------------------------

  useEffect(() => {
    let interval;

    if (tracking?.status === "running") {
      interval = setInterval(() => {
        setLiveSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setLiveSeconds(0);
    }

    return () => clearInterval(interval);
  }, [tracking]);

  // -----------------------------
  // Helpers
  // -----------------------------

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return (
      String(hrs).padStart(2, "0") +
      ":" +
      String(mins).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0")
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // -----------------------------
  // Button Actions
  // -----------------------------

  const handleStart = async () => {
    try {
      await startTimer(id);

      await fetchTracker();
      await fetchLogs();
    } catch (err) {
      alert(err.response?.data?.error || "Unable to start timer.");
    }
  };

  const handlePause = async () => {
    try {
      await pauseTimer(tracking.id);

      await fetchTracker();
      await fetchLogs();
    } catch (err) {
      alert(err.response?.data?.error || "Unable to pause timer.");
    }
  };

  const handleResume = async () => {
    try {
      await resumeTimer(tracking.id);

      await fetchTracker();
      await fetchLogs();
    } catch (err) {
      alert(err.response?.data?.error || "Unable to resume timer.");
    }
  };

  const handleStop = async () => {
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

      {/* Navbar */}

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

      {/* Hero */}

      <section className="relative z-10 px-8 pt-10">

        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => router.back()}
            className="mb-8 text-cyan-400 hover:text-cyan-300 transition"
          >
            ← Back
          </button>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

              <div>

                <h1 className="text-5xl font-black">
                  {project?.title || "Project"}
                </h1>

                <p className="text-gray-400 mt-4 text-lg max-w-3xl">
                  {project?.description}
                </p>

              </div>

              <div className="text-center">

                <div
                  className={`px-6 py-3 rounded-full font-bold text-lg
                    ${
                      tracking?.status === "running"
                        ? "bg-green-500/20 text-green-400"
                        : tracking?.status === "paused"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : tracking?.status === "completed"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                >
                  {tracking?.status || "Not Started"}
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Timer */}

      <section className="relative z-10 px-8 mt-12">

        <div className="max-w-5xl mx-auto">

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-12 text-center">

            <h2 className="text-2xl text-gray-400 mb-8">
              Live Work Timer
            </h2>

            <h1
              className={`text-8xl font-black tracking-widest transition-all duration-300
              ${
                tracking?.status === "running"
                  ? "text-cyan-400 animate-pulse"
                  : "text-white"
              }`}
            >
              {formatTime(elapsedSeconds + liveSeconds)}
            </h1>

            <p className="mt-6 text-gray-400 text-lg">
              Total Time Worked
            </p>

          </div>

        </div>

      </section>

      {/* Action Buttons */}

      <section className="relative z-10 px-8 mt-10">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-5">

          <button
            onClick={handleStart}
            disabled={tracking?.status === "running"}
            className="py-4 rounded-2xl bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed font-bold text-lg transition"
          >
            ▶ Start
          </button>

          <button
            onClick={handlePause}
            disabled={tracking?.status !== "running"}
            className="py-4 rounded-2xl bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-700 disabled:cursor-not-allowed font-bold text-lg transition"
          >
            ⏸ Pause
          </button>

          <button
            onClick={handleResume}
            disabled={tracking?.status !== "paused"}
            className="py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed font-bold text-lg transition"
          >
            ▶ Resume
          </button>

          <button
            onClick={handleStop}
            disabled={
              !tracking ||
              tracking.status === "completed"
            }
            className="py-4 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed font-bold text-lg transition"
          >
            ■ Stop
          </button>

        </div>

      </section>

      {/* Statistics */}

      <section className="relative z-10 px-8 mt-12">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <p className="text-gray-400">
              Status
            </p>

            <h2 className="text-4xl font-black mt-3 text-cyan-400">
              {tracking?.status || "New"}
            </h2>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <p className="text-gray-400">
              Total Time
            </p>

            <h2 className="text-4xl font-black mt-3 text-cyan-400">
              {formatTime(elapsedSeconds)}
            </h2>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <p className="text-gray-400">
              Sessions
            </p>

            <h2 className="text-4xl font-black mt-3 text-cyan-400">
              {logs.length}
            </h2>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <p className="text-gray-400">
              Project Budget
            </p>

            <h2 className="text-4xl font-black mt-3 text-cyan-400">
              ₹{project?.budget || 0}
            </h2>

          </div>

        </div>

      </section>

            {/* Work Session History */}

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

                      <th className="text-left p-5 font-bold">
                        #
                      </th>

                      <th className="text-left p-5 font-bold">
                        Start Time
                      </th>

                      <th className="text-left p-5 font-bold">
                        End Time
                      </th>

                      <th className="text-left p-5 font-bold">
                        Duration
                      </th>

                      <th className="text-left p-5 font-bold">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {logs.map((log, index) => (

                      <tr
                        key={log.id}
                        className="border-t border-white/10 hover:bg-white/5 transition"
                      >

                        <td className="p-5">
                          {index + 1}
                        </td>

                        <td className="p-5 text-gray-300">
                          {formatDate(log.start_time)}
                        </td>

                        <td className="p-5 text-gray-300">

                          {!log.end_time ||
                          log.end_time.startsWith("0001-01-01")
                            ? (
                              <span className="text-green-400 font-semibold">
                                Running
                              </span>
                            )
                            : formatDate(log.end_time)}

                        </td>

                        <td className="p-5">

                          <span className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 font-semibold">

                            {formatTime(log.duration_seconds)}

                          </span>

                        </td>

                        <td className="p-5">

                          {!log.end_time ||
                          log.end_time.startsWith("0001-01-01") ? (

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

                    ))}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="py-20 text-center">

                <div className="text-7xl mb-5">
                  ⏱
                </div>

                <h3 className="text-3xl font-bold">
                  No Work Sessions Yet
                </h3>

                <p className="text-gray-400 mt-4">

                  Click the

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

      {/* Footer */}

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-gray-500">

        © 2026 FreelanceX • Professional Freelancer Workspace

      </footer>

    </main>

  );
}