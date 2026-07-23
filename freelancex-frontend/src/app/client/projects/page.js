"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {

  const router = useRouter();

  // ==========================
  // STATES
  // ==========================

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // UPDATE PROJECT STATUS
  // ==========================

  const updateStatus = async (projectId, status) => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(

        `http://localhost:8080/projects/${projectId}/status`,

        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),

        }

      );

      if (!res.ok) {

        const err = await res.json();
        alert(err.error || "Unable to update status.");
        return;

      }

      fetchProjects();

    }

    catch (err) {

      console.error(err);
      alert("Something went wrong.");

    }

  };

  // ==========================
  // FETCH CLIENT PROJECTS
  // ==========================

  const fetchProjects = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/projects"
      );

      if (!res.ok) {

        throw new Error("Unable to fetch projects");

      }

      const data = await res.json();

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const myProjects = data.filter(

        (project) =>

          Number(project.client_id) ===
          Number(user.id)

      );

      setProjects(myProjects);

    }

    catch (err) {

      console.error(err);

    }

    finally {

      setLoading(false);

    }

  };

  // ==========================
  // LOAD PROJECTS
  // ==========================

  useEffect(() => {

    fetchProjects();

  }, []);

  // ==========================
  // UI
  // ==========================

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

  {/* Background */}

  <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

  <div className="relative z-10 max-w-7xl mx-auto">

    {/* Header */}

    <div className="flex justify-between items-center mb-12">

      <div>

        <h1 className="text-5xl font-black">
          My Projects
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Manage all your posted projects from one place.
        </p>

      </div>

      <button
        onClick={() => router.push("/client/dashboard")}
        className="
          px-6
          py-3
          rounded-2xl
          bg-white/10
          hover:bg-white/20
          transition
        "
      >
        Dashboard
      </button>

    </div>

    {/* Loading */}

    {loading && (

      <div className="flex justify-center py-24">

        <div
          className="
            h-16
            w-16
            rounded-full
            border-4
            border-blue-500
            border-t-transparent
            animate-spin
          "
        />

      </div>

    )}

    {/* Empty State */}

    {!loading && projects.length === 0 && (

      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          backdrop-blur-xl
          p-16
          text-center
        "
      >

        <h2 className="text-3xl font-bold">
          No Projects Yet
        </h2>

        <p className="text-gray-400 mt-4">
          Post your first project to hire freelancers.
        </p>

      </div>

    )}

    {/* Project Grid */}

    {!loading && projects.length > 0 && (

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {projects.map((project) => {

          const status = (
            project.status || ""
          ).trim().toLowerCase();

          return (

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
              "
            >

              <div>

                {/* Title */}

                <h2 className="text-2xl font-bold mb-5">

                  {project.title}

                </h2>

                {/* Description */}

                <p className="text-gray-400 leading-7 min-h-[90px]">

                  {project.description}

                </p>

              </div>

              <div className="mt-8">

                {/* Budget */}

                <div className="flex justify-between items-center mb-4">

                  <span className="text-gray-400">
                    Budget
                  </span>

                  <span className="text-green-400 text-2xl font-bold">

                    ₹{project.budget}

                  </span>

                </div>

                {/* Proposal Count */}

                <div className="flex justify-between items-center mb-5">

                  <span className="text-gray-400">
                    Proposals
                  </span>

                  <span className="text-blue-400 font-semibold">

                    {project.proposal_count}

                  </span>

                </div>

                {/* Status */}

                <div className="mb-6">

                  <p className="text-gray-400 mb-3">
                    Project Status
                  </p>

                  {status === "assigned" ? (

                    <div
                      className="
                        w-full
                        rounded-xl
                        bg-black-600
                        py-3
                        text-center
                        font-semibold
                      "
                    >
                  
                    </div>

                  ) : status === "completed" ? (

                    <div
                      className="
                        w-full
                        rounded-xl
                        bg-green-700
                        py-3
                        text-center
                        font-semibold
                      "
                    >
                      Completed
                    </div>

                  ) : (

                    <select
                      value={status}
                      onChange={(e) =>
                        updateStatus(
                          project.id,
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        bg-black
                        border
                        border-gray-700
                        rounded-xl
                        px-4
                        py-3
                        text-white
                      "
                    >

                      <option value="open">
                        Open
                      </option>

                      <option value="under_review">
                        Under Review
                      </option>

                      <option value="closed">
                        Closed
                      </option>

                    </select>

                  )}

                </div>

                {/* ACTION BUTTONS WILL COME IN PART 3 */}
                {/* ==========================
    ACTION BUTTONS
========================== */}

<div className="flex flex-col gap-3">

  {/* OPEN / UNDER REVIEW */}

  {(status === "open" ||
    status === "under_review") && (

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
        hover:bg-blue-700
        transition
        font-semibold
      "
    >
      View Proposals
    </button>

  )}

  {/* ASSIGNED */}

  {status === "assigned" && (

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
        onClick={() =>
          router.push("/client/messages")
        }
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
        onClick={() => {

          const ok = window.confirm(
            "Are you sure this project has been completed?"
          );

          if (ok) {

            updateStatus(
              project.id,
              "completed"
            );

          }

        }}
        className="
          w-full
          py-3
          rounded-xl
          bg-green-600
          hover:bg-green-700
          transition
          font-semibold
        "
      >
        Mark as Completed
      </button>

    </>

  )}

  {/* COMPLETED */}

  {status === "completed" && (

    <>

      <button
        disabled
        className="
          w-full
          py-3
          rounded-xl
          bg-green-700
          text-white
          font-semibold
          cursor-not-allowed
        "
      >
        Project Completed
      </button>

      <button
        onClick={() =>
          router.push("/client/messages")
        }
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
          router.push(
            `/client/review/${project.id}`
          )
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
        Rate Freelancer
      </button>

    </>

  )}

  {/* CLOSED */}

  {status === "closed" && (

    <button
      disabled
      className="
        w-full
        py-3
        rounded-xl
        bg-gray-700
        text-gray-300
        font-semibold
        cursor-not-allowed
      "
    >
      Project Closed
    </button>

  )}

</div>

            </div>

          </div>

        );

      })}

      </div>

    )}

  </div>

</main>

);
}