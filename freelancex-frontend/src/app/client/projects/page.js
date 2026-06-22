"use client";

import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:8080/projects");

      const data = await res.json();

      console.log("PROJECTS:", data);

      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-10 text-400">
          All Projects
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400">Loading projects...</p>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <p className="text-center text-gray-400">
            No projects found
          </p>
        )}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 hover:border-blue-500 transition"
            >

              {/* Title */}
              <h2 className="text-xl font-bold text-white mb-2">
                <br>
                </br>    {project.title}
              </h2>

              {/* Description */}
              <br></br>
              <p className="text-gray-400 text-sm mb-4">
                What we need ? <br></br>{project.description}
              </p>

              {/* Budget */}
              <br></br>
              <br></br>
              <p className="text-green-400 font-semibold">
                Budget :  ₹{project.budget}
               
              </p>

              {/* Status */}
              <p className="mt-2 text-sm">
                <br></br>
                <br></br>
                Status:{" "}
                <span
                  className={
                    project.status === "open"
                      ? "text-blue-400"
                      : project.status === "in-progress"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }
                >
                  {project.status}
                </span>
              </p>

            </div>
          ))}

        </div>
      </div>
    </main>
  );
}