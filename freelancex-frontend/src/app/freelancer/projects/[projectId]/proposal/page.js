"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ProposalPage() {
  const { projectId } = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);

  const [bidAmount, setBidAmount] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [skills, setSkills] = useState("");
  const [loadingProject, setLoadingProject] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load Project Details
  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/projects/${projectId}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Project not found");
        router.push("/freelancer/projects");
        return;
      }

      setProject(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load project.");
    } finally {
      setLoadingProject(false);
    }
  };

  const submitProposal = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/proposals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_id: Number(projectId),
            bid_amount: Number(bidAmount),
            delivery_days: Number(deliveryDays),
            cover_letter: coverLetter,
            skills: skills,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to submit proposal");
        return;
      }

      alert("Proposal submitted successfully!");

      router.push("/freelancer/projects");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProject) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading Project...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Background */}

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* Navbar */}

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">

        <h1 className="text-5xl font-black tracking-wide">

          <span style={{ color: "cyan" }}>
            Freelance
          </span>

          <span className="text-white">
            X
          </span>

        </h1>

        <Link
          href="/freelancer/projects"
          className="px-5 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition"
        >
          Back to Projects
        </Link>

      </nav>

      <section className="relative z-10 px-8 py-10">

        <div className="max-w-5xl mx-auto">

          <h2 className="text-5xl font-black mb-3">
            Submit Proposal
          </h2>

          <p className="text-gray-400 mb-8">
            Send your proposal to the client by filling in the details below.
          </p>

          {/* Project Card */}

          <div
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              backdrop-blur-xl
              p-8
              mb-8
            "
          >

            <h3 className="text-3xl font-bold">
              {project.title}
            </h3>

            <p className="text-gray-400 mt-3 leading-7">
              {project.description}
            </p>

            <div className="grid grid-cols-2 gap-8 mt-8">

              <div>

                <p className="text-gray-500 text-sm">
                  Budget
                </p>

                <h4 className="text-2xl font-bold mt-2">
                  ₹ {project.budget}
                </h4>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <h4 className="text-2xl font-bold mt-2 capitalize">
                  {project.status}
                </h4>

              </div>

            </div>

          </div>
                    {/* Proposal Form */}

          <div
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              backdrop-blur-xl
              p-8
            "
          >

            <form
              onSubmit={submitProposal}
              className="space-y-7"
            >

              <div>

                <label className="block text-lg font-semibold mb-3">
                  Bid Amount (₹)
                </label>

                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) =>
                    setBidAmount(e.target.value)
                  }
                  placeholder="Enter your quotation"
                  className="
                    w-full
                    rounded-2xl
                    bg-black/20
                    border
                    border-white/10
                    px-5
                    py-4
                    outline-none
                    focus:border-[#1424ff]
                    transition
                  "
                  required
                />

              </div>

              <div>

                <label className="block text-lg font-semibold mb-3">
                  Delivery Days
                </label>

                <input
                  type="number"
                  value={deliveryDays}
                  onChange={(e) =>
                    setDeliveryDays(e.target.value)
                  }
                  placeholder="Estimated delivery time"
                  className="
                    w-full
                    rounded-2xl
                    bg-black/20
                    border
                    border-white/10
                    px-5
                    py-4
                    outline-none
                    focus:border-[#1424ff]
                    transition
                  "
                  required
                />

              </div>

              <div>

                <label className="block text-lg font-semibold mb-3">
                  Cover Letter
                </label>

                <textarea
                  rows={8}
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(e.target.value)
                  }
                  placeholder="Describe your experience, approach, timeline and why you are the right freelancer for this project..."
                  className="
                    w-full
                    rounded-2xl
                    bg-black/20
                    border
                    border-white/10
                    px-5
                    py-4
                    outline-none
                    resize-none
                    focus:border-[#1424ff]
                    transition
                  "
                  required
                />

                <div className="text-right mt-2 text-sm text-gray-500">
                  {coverLetter.length} characters
                </div>

              </div>

              <div>

  <label className="block text-lg font-semibold mb-3">
    My Skills
  </label>

  <input
    type="text"
    value={skills}
    onChange={(e) => setSkills(e.target.value)}
    placeholder="React, Next.js, Go, PostgreSQL"
    className="
      w-full
      rounded-2xl
      bg-black/20
      border
      border-white/10
      px-5
      py-4
      outline-none
      focus:border-[#1424ff]
      transition
    "
    required
  />

  <p className="text-sm text-gray-500 mt-2">
    Separate your skills using commas.
  </p>

</div>

              <div className="flex justify-end gap-4 pt-4">

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="
                    px-8
                    py-4
                    rounded-2xl
                    border
                    border-white/10
                    hover:bg-white/10
                    transition
                    font-semibold
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    px-10
                    py-4
                    rounded-2xl
                    bg-[#1424ff]
                    hover:bg-blue-700
                    transition
                    font-bold
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Proposal"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}