"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FreelancerMessagesPage() {

  const router = useRouter();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("Conversations:", data);

      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        setConversations([]);
      }

    } catch (err) {

      console.error(err);
      setConversations([]);

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-10">

        <h1 className="text-5xl font-black mb-10">

          My Conversations

        </h1>

        {loading && (

          <p className="text-gray-400">

            Loading conversations...

          </p>

        )}

        {!loading && conversations.length === 0 && (

          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">

            No conversations yet.

          </div>

        )}

        <div className="space-y-6">

          {conversations.map((conversation) => (

            <div
              key={conversation.id}
             onClick={() => {
  console.log("Card clicked", conversation.id);
  router.push(
  `/freelancer/messages/${conversation.id}?client=${conversation.client_id}&freelancer=${conversation.freelancer_id}`
);
}}
              className="
                cursor-pointer
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-8
                hover:bg-white/10
                transition
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">

                    Conversation #{conversation.id}

                  </h2>
                                    <p className="text-gray-400 mt-2">

                    Project ID : {conversation.project_id}

                  </p>

                </div>

                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-blue-500/20
                    text-blue-400
                  "
                >
                  Open Chat
                </span>

              </div>

              <div className="mt-6">

                <p className="text-gray-400 mb-2">

                  Last Message

                </p>

                <div
                  className="
                    bg-black/20
                    rounded-2xl
                    p-5
                  "
                >

                  {conversation.last_message ? (

                    <p className="text-white">

                      {conversation.last_message}

                    </p>

                  ) : (

                    <p className="text-gray-500">

                      No messages yet

                    </p>

                  )}

                </div>

              </div>

              <div className="mt-6 flex justify-between items-center">

                <p className="text-sm text-gray-500">

                  Freelancer ID : {conversation.freelancer_id}

                </p>

                <p className="text-sm text-gray-500">

                  Client ID : {conversation.client_id}

                </p>

              </div>

              <div className="mt-6 flex justify-end">

                <button
                  onClick={(e) => {
  e.stopPropagation();

  console.log("✅ Button clicked");
  console.log("Conversation ID:", conversation.id);

   router.push(
  `/freelancer/messages/${conversation.id}?client=${conversation.client_id}&freelancer=${conversation.freelancer_id}`
);
}}
                  
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-[#1424ff]
                    hover:bg-blue-700
                    transition
                    font-semibold
                  "
                >

                  Open Conversation

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );

}