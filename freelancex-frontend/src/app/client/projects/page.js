"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
const updateStatus = async (projectId, status) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:8080/projects/${projectId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    fetchProjects();
  } catch (err) {
    console.error(err);
  }
};
   const fetchProjects = async () => {
  try {
    const res = await fetch(
      "http://localhost:8080/projects"
    );

    const data = await res.json();

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const myProjects = data.filter(
      (project) =>
        Number(project.client_id) === Number(user.id)
    );

    console.log("PROJECTS:", myProjects);

    setProjects(myProjects);

  } catch (err) {
    console.error(
      "Error fetching projects:",
      err
    );
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

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-5xl font-black text-center mb-12">
          My Projects
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400 text-lg">
            Loading projects...
          </p>
        )}

        {/* Empty */}
        {!loading &&
          projects.length === 0 && (
            <p className="text-center text-gray-400 text-lg">
              No projects found
            </p>
          )}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.map((project) => (
            <div
              key={project.id}
              className="
                bg-white/5
                border
                border-white/10
                backdrop-blur-xl
                rounded-3xl
                p-7
                hover:border-blue-500
                transition
                flex
                flex-col
                justify-between
                min-h-[380px]
              "
            >
              <div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-5">
                  {project.title}
                </h2>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {project.description}
                </p>

              </div>

              <div className="mt-8">

                {/* Budget */}
                <p className="text-green-400 font-bold text-lg">
                  Budget: ₹{project.budget}
                </p>

                {/* Proposal Count */}
                <p className="mt-3 text-blue-400 font-semibold">
                  Proposals Received:{" "}
                  {project.proposal_count}
                </p>

                {/* Status */}
                <div className="mt-4">
  <p className="text-gray-400 mb-2">
    Project Status
  </p>

{project.status === "assigned" ? (

  <div
    className="
      w-full
      py-2
      rounded-xl
      bg-black-600
      text-white
      text-center
      font-semibold
    "
  >
   
  </div>

) : (

  <select
    value={project.status || "open"}
    onChange={(e) =>
      updateStatus(project.id, e.target.value)
    }
    className="
      bg-black
      border
      border-gray-700
      text-white
      rounded-xl
      px-4
      py-2
      w-full
    "
  >
    <option value="open">Open</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
    <option value="closed">Closed</option>
  </select>

)}
</div>

                {/* Buttons */}
                {/* Buttons */}
<div className="mt-6 flex flex-col gap-3">

  {/* OPEN / IN PROGRESS / CLOSED */}
  {(project.status === "open" ||
    project.status === "in_progress" ||
    project.status === "closed") && (

    <button
      onClick={() =>
        router.push(
          `/client/projects/${project.id}/proposals`
        )
      }
      className="
        w-full
        py-3
        rounded-xl
        bg-[#1424ff]
        font-semibold
        hover:opacity-90
        transition
      "
    >
      View Proposals
    </button>

  )}

  {/* ASSIGNED */}
  {project.status === "assigned" && (

    <>
      <button
        disabled
        className="
          w-full
          py-3
          rounded-xl
          bg-red-600
          text-white
          font-semibold
          cursor-not-allowed
        "
      >
        Project Assigned
      </button>

      <button
        onClick={() => router.push("/client/messages")}
        className="
          w-full
          py-3
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          transition
          font-semibold
        "
      >
        Message Freelancer
      </button>

    </>

  )}

  {/* COMPLETED */}
  {project.status === "completed" && (

    <>
      <button
        disabled
        className="
          w-full
          py-3
          rounded-xl
          bg-green-600
          text-white
          font-semibold
          cursor-not-allowed
        "
      >
        Project Completed
      </button>

      <button
        onClick={() => router.push("/client/messages")}
        className="
          w-full
          py-3
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          transition
          font-semibold
        "
      >
        Message Freelancer
      </button>

      <button
        onClick={() =>
          router.push(`/client/review/${project.id}`)
        }
        className="
          w-full
          py-3
          rounded-xl
          bg-yellow-500
          hover:bg-yellow-600
          text-black
          font-bold
          transition
        "
      >
        ⭐ Rate Freelancer
      </button>

    </>

  )}

</div>


              </div>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}