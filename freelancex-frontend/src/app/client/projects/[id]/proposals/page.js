"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectProposalsPage() {
  const params = useParams();
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/projects/${params.id}/proposals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
console.log("PROPOSALS DATA:", data);
console.log("Is Array?", Array.isArray(data));
     if (Array.isArray(data)) {
  setProposals(data);
} else {
  console.log("Backend returned:", data);
  setProposals([]);
}
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (proposal) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:8080/conversations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: Number(params.id),
          freelancer_id: proposal.freelancer_id,
        }),
      }
    );
const data = await res.json();

console.log("STATUS:", res.status);
console.log("FULL RESPONSE:", data);
console.log("ID:", data.id);
console.log("ConversationID:", data.conversation_id);
console.log("Keys:", Object.keys(data));

if (!res.ok) {
  alert(JSON.stringify(data));
  return;
}

console.log("Conversation returned:", data);
router.push(`/client/messages/${data.id}`);



  } catch (err) {
    console.error(err);
    alert("Failed to create conversation");
  }
};

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">

        <h1 className="text-5xl font-black mb-10">
          Project Proposals
        </h1>

        {loading && (
          <p className="text-gray-400">
            Loading proposals...
          </p>
        )}

        {!loading && proposals.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
            No proposals received yet.
          </div>
        )}

        <div className="space-y-6">

          {proposals.map((proposal) => (

            <div
              key={proposal.id}
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-8
                backdrop-blur-xl
              "
            >

              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">
                  Freelancer #{proposal.freelancer_id}
                </h2>

                <span className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400">
                  {proposal.status}
                </span>

              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">

                <div className="bg-black/20 rounded-2xl p-5">
                  <p className="text-gray-400 mb-2">
                    Bid Amount
                  </p>

                  <p className="text-3xl font-black text-green-400">
                    ₹{proposal.bid_amount}
                  </p>
                </div>

                <div className="bg-black/20 rounded-2xl p-5">
                  <p className="text-gray-400 mb-2">
                    Delivery Time
                  </p>

                  <p className="text-3xl font-black text-blue-400">
                    {proposal.delivery_days} Days
                  </p>
                </div>

              </div>

              <div className="mt-6 bg-black/20 rounded-2xl p-6">

                <h3 className="font-bold text-lg mb-3">
                  Cover Letter
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  {proposal.cover_letter}
                </p>

              </div>

              <div className="mt-6 flex gap-4">

                <button
                 onClick={() => createConversation(proposal)}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-[#1424ff]
                    font-semibold
                  "
                >
                  Chat Freelancer
                </button>

                <button
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-green-600
                    font-semibold
                  "
                >
                  Assign Project
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </main>
  );
}