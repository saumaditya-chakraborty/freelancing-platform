


"use client";

import { useEffect, useState } from "react";

export default function FreelancerProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [bidAmount, setBidAmount] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitProposal = async () => {
    try {
      if (!selectedProject) {
        alert("Please select a project first");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/proposals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_id: selectedProject.id,
            bid_amount: Number(bidAmount),
            cover_letter: coverLetter,
            delivery_days: Number(deliveryDays),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Proposal Submitted Successfully");

      setBidAmount("");
      setCoverLetter("");
      setDeliveryDays("");
      setSelectedProject(null);
    } catch (error) {
      console.error(error);
    }
  };

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

        <a
          href="/freelancer/dashboard"
          className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition"
        >
          Dashboard
        </a>
      </nav>

      {/* Heading */}
      <section className="relative z-10 px-8 pt-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black">
            Browse Projects
          </h2>

          <p className="mt-3 text-gray-400">
            Find projects that match your skills and submit proposals.
          </p>
        </div>
      </section>

    {/* Projects Grid */}
<section className="relative z-10 px-8 py-10">
  <div className="max-w-7xl mx-auto">

    {projects.length === 0 ? (

      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-gray-400">
        No Projects Found
      </div>

    ) : (

      <div className="grid md:grid-cols-3 gap-6">

          {projects.map((project) => {

  const canBid =
    project.status === "open" ||
    project.status === "reviewing_proposals";

  return (

    <div
      key={project.id}
      className={`
        bg-white/5
        border
        rounded-3xl
        p-8
        backdrop-blur-xl
        transition
        hover:border-[#1424ff]
        hover:scale-[1.02]
        h-[340px]
        flex
        flex-col
        justify-between
        overflow-hidden
        ${
          selectedProject?.id === project.id
            ? "border-[#1424ff]"
            : "border-white/10"
        }
      `}
    >

      {/* TOP CONTENT */}

      <div className="space-y-5">

        <h3 className="text-3xl font-black leading-tight break-words">
          {project.title}
        </h3>

        <p className="text-gray-400 leading-relaxed break-words text-base">
          {project.description}
        </p>

      </div>

      {/* BOTTOM CONTENT */}

      <div className="pt-6 border-t border-white/10">

        <div className="flex justify-between items-center mb-5">

          <span className="text-3xl font-black text-[#1424ff]">
            ₹{project.budget}
          </span>

          <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold">
            {project.status}
          </span>

        </div>

        {canBid ? (

          <button
            onClick={() => setSelectedProject(project)}
            className="
              w-full
              py-4
              rounded-2xl
              bg-[#1424ff]
              font-bold
              text-lg
              hover:opacity-90
              transition
            "
          >
            Bid Now
          </button>

        ) : (

          <button
            disabled
            className="
              w-full
              py-4
              rounded-2xl
              bg-red-500/20
              border
              border-red-500/40
              text-red-400
              font-bold
              cursor-not-allowed
            "
          >
            Oops! The project bidding window is closed.
          </button>

        )}

      </div>

    </div>

  );

})}

      </div>

    )}

  </div>
</section>
                
                
      

      {/* Proposal Section */}
      <section className="relative z-10 px-8 pb-20">
        <div className="max-w-5xl mx-auto">

          <div
            className="
    bg-gradient-to-r
    from-[#1424ff]/20
    via-black/40
    to-[#1424ff]/10
    border
    border-[#1424ff]/30
    rounded-[32px]
    backdrop-blur-xl
    px-14
    py-12
  "
          >
            {!selectedProject ? (
              <div className="text-center py-16">

                <h2 className="text-4xl font-black mb-4">
                  Submit Proposal
                </h2>

                <p className="text-gray-400 text-lg">
                  Select a project above to start bidding.
                </p>

              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-12 text-center">

                  <h2 className="text-5xl font-black mb-4">
                    Submit Proposal
                    <br></br>
                  </h2>

                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    <br></br> Tell the client why you're the perfect fit.
                  </p>

                </div>

                {/* Selected Project Card */}
                <div
                  className="
            mt-12
            mb-12
            px-8
            py-8
            rounded-3xl
            bg-white/5
            border
            border-white/10
          "
                >
                  <h3 className="text-3xl font-bold mb-4">
                    {selectedProject.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Inputs */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">

                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Bid Amount (₹)"
                    className="
            w-full
            px-8
            py-6
            rounded-2xl
            bg-black/20
            border
            border-white/10
            outline-none
            text-lg
            focus:border-[#1424ff]
          "
                  />

                  <input
                    type="number"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    placeholder="Delivery Days"
                    className="
            w-full
            px-6
            py-5
            rounded-2xl
            bg-black/20
            border
            border-white/10
            outline-none
            text-lg
            focus:border-[#1424ff]
          "
                  />

                </div>

                {/* Cover Letter */}
                <textarea
                  rows="10"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Describe your plan, timeline, tech stack and why the client should hire you..."
                  className="
          w-full
          px-8
          py-6
          rounded-3xl
          bg-black/20
          border
          border-white/10
          outline-none
          resize-none
          text-base
          leading-relaxed
          focus:border-[#1424ff]
        "
                />

                {/* Submit Button */}
                <button
                  onClick={submitProposal}
                  className="
          w-full
          mt-10
          py-5
          rounded-2xl
          bg-[#1424ff]
          font-black
          text-xl
          hover:opacity-90
          transition
        "
                >
                  Submit Proposal
                </button>
              </>
            )}
          </div>

        </div>



      </section>

    </main>
  );
}