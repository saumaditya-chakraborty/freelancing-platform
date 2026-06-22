"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getConversations,
  getMessages,
} from "@/services/message";

export default function MessagesPage() {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") || "{}"
        )
      : {};

  const userId = user?.id;

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getConversations();

      if (Array.isArray(data)) {
        setConversations(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(
      `ws://localhost:8080/ws/${userId}`
    );

    ws.onopen = () => {
      console.log("Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => [
        ...prev,
        {
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.message,
        },
      ]);

      loadConversations();
    };

    ws.onerror = (err) => {
      console.error(err);
    };

    setSocket(ws);

    return () => ws.close();
  }, [userId]);

  const openConversation = async (
    conversation
  ) => {
    setSelectedConversation(conversation);

    try {
      const history =
        await getMessages(conversation.id);

      setMessages(history);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (
      !socket ||
      !selectedConversation ||
      !input.trim()
    )
      return;

    let receiverId;

    if (
      selectedConversation.user1_id === userId
    ) {
      receiverId =
        selectedConversation.user2_id;
    } else {
      receiverId =
        selectedConversation.user1_id;
    }

    socket.send(
      JSON.stringify({
        receiver_id: String(receiverId),
        message: input,
      })
    );

    setMessages((prev) => [
      ...prev,
      {
        sender_id: userId,
        receiver_id: receiverId,
        content: input,
      },
    ]);

    setInput("");
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

        <div className="flex items-center gap-4">
          <Link
            href="/client/dashboard"
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition"
          >
            Dashboard
          </Link>

          <div className="h-11 w-11 rounded-full bg-[#1424ff] flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase() ||
              "U"}
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="relative z-10 px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-3">
            Messages
          </h2>

          <p className="text-gray-400 mb-10">
            Chat with freelancers, discuss
            project updates and milestones.
          </p>

          <div className="grid grid-cols-12 gap-6 h-[75vh]">
            {/* Conversations */}
            <div className="col-span-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">
              <div className="p-2 border-b border-white/10">
                <h3 className="text-xl font-bold">
                    <br></br>
                  Conversations
                  <br></br>
                </h3>
              </div>

              <div className="overflow-y-auto h-full">
                {conversations.length === 0 ? (
                  <div className="p-2 text-gray-400">
                    <br></br>
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() =>
                        openConversation(conv)
                      }
                      className={`p-5 border-b border-white/5 cursor-pointer transition hover:bg-white/5 ${
                        selectedConversation?.id ===
                        conv.id
                          ? "bg-white/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#1424ff] flex items-center justify-center font-bold">
                          U
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold">
                            Conversation #
                            {conv.id}
                          </h4>

                          <p className="text-sm text-gray-400 truncate">
                            {conv.last_message ||
                              "Start chatting"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl flex flex-col">
              <div className="p-5 border-b border-white/10">
                <h3 className="text-xl font-bold">
                  {selectedConversation
                    ? `Conversation #${selectedConversation.id}`
                    : "Select a Conversation"}
                </h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[70%] px-5 py-3 rounded-2xl ${
                      Number(msg.sender_id) ===
                      Number(userId)
                        ? "ml-auto bg-[#1424ff]"
                        : "bg-white/10"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {selectedConversation && (
                <div className="p-5 border-t border-white/10 flex gap-3">
                  <input
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value)
                    }
                    placeholder="Type your message..."
                    className="flex-1 px-5 py-4 rounded-2xl bg-black/20 border border-white/10 outline-none focus:border-[#1424ff]"
                  />

                  <button
                    onClick={sendMessage}
                    className="px-8 py-4 rounded-2xl bg-[#1424ff] font-bold hover:opacity-90 transition"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}