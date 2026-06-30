"use client";

import { useEffect, useState } from "react";

export default function MyBidsPage() {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/proposals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const myBids = data.filter(
        (proposal) =>
          proposal.freelancer_id === user.id ||
          proposal.FreelancerID === user.id
      );

      setProposals(myBids);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProposal = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/proposals/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Failed to delete proposal");
        return;
      }

      setProposals((prev) =>
        prev.filter(
          (proposal) =>
            proposal.id !== id &&
            proposal.ID !== id
        )
      );

      alert("Proposal Deleted");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

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

      <section className="relative z-10 px-8 pt-12 text-center">

        <h2 className="text-5xl font-black">
          My Bids
        </h2>

        <p className="mt-4 text-gray-400 text-lg">
          Track all proposals you've submitted.
        </p>

      </section>

      <section className="relative z-10 px-8 py-12">

        <div className="max-w-6xl mx-auto space-y-6">

          {proposals.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-gray-400">
              No proposals submitted yet.
            </div>
          ) : (
            proposals.map((proposal) => (
              <div
                key={proposal.id || proposal.ID}
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-3xl
                  p-8
                  backdrop-blur-xl
                "
              >
                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="text-2xl font-bold mb-4">
                      {proposal.project?.title || `Project #${proposal.project_id}`}
                    </h3>

                    <div className="space-y-2 text-gray-300">

                      <p>
                        Bid Amount:
                        <span className="ml-2 text-white font-semibold">
                          ₹{proposal.bid_amount || proposal.BidAmount}
                        </span>
                      </p>

                      <p>
                        Delivery Days:
                        <span className="ml-2 text-white font-semibold">
                          {proposal.delivery_days || proposal.DeliveryDays}
                        </span>
                      </p>

                      <p>
                        Status:
                        <span
                          className={`ml-2 font-semibold ${(proposal.status || proposal.Status) ===
                              "accepted"
                              ? "text-green-400"
                              : (proposal.status || proposal.Status) ===
                                "rejected"
                                ? "text-red-400"
                                : "text-yellow-400"
                            }`}
                        >
                          {proposal.status || proposal.Status}
                        </span>
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      deleteProposal(
                        proposal.id || proposal.ID
                      )
                    }
                    className="
                      px-5
                      py-3
                      rounded-xl
                      bg-red-500/20
                      text-red-400
                      hover:bg-red-500/30
                      transition
                    "
                  >
                    Delete Bid
                  </button>

                </div>

                {(proposal.cover_letter ||
                  proposal.CoverLetter) && (
                    <div className="mt-6 pt-6 border-t border-white/10">

                      <h4 className="font-semibold mb-3">
                        Cover Letter
                      </h4>

                      <p className="text-gray-400">
                        {proposal.cover_letter ||
                          proposal.CoverLetter}
                      </p>

                    </div>
                  )}
              </div>
            ))
          )}

        </div>

      </section>

    </main>
  );
}