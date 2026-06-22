"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
        }),
      });

      const data = await res.json();

      console.log("CREATE PROJECT:", data);

      if (!res.ok) {
        alert(data.error || "Failed to create project");
        return;
      }

      alert("Project posted successfully!");

      // redirect to projects page
      router.push("/client/projects");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center px-6">

      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl">

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-wide">
              <span style={{ color: "cyan" }}>Post</span>
              <span className="text-white"> Project</span>
            </h1>

            <p className="text-gray-400 mt-3">
              Create a new project and find freelancers
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Project Title
              </label>

              <input
                type="text"
                placeholder="Enter project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Project Description
              </label>

              <textarea
                placeholder="Describe your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 h-32 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Budget (₹)
              </label>

              <input
                type="number"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-[#1424ff] transition"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1424ff] hover:opacity-90 transition font-semibold"
            >
              {loading ? "Posting..." : "Post Project"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}