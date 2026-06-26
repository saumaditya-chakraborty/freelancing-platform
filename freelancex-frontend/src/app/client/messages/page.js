"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getConversations,
  getMessages,
} from "@/services/message";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);

  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const userId = user?.id;

  // Load logged in user
  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    setUser(storedUser);
  }, []);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getConversations();

      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open websocket for selected conversation
  useEffect(() => {
    if (!selectedConversation || !userId) return;

    if (socket.current) {
      socket.current.close();
    }

    socket.current = new WebSocket(
      `ws://localhost:8080/ws/${selectedConversation.id}/${userId}`
    );

    socket.current.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    socket.current.onmessage = (event) => {
      console.log("Incoming WebSocket:", event.data);
      const msg = JSON.parse(event.data);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          content: msg.message,
        },
      ]);

      loadConversations();
    };

    socket.current.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    socket.current.onclose = () => {
      console.log("WebSocket Closed");
    };

    return () => {
      socket.current?.close();
    };
  }, [selectedConversation, userId]);

  const openConversation = async (conversation) => {
    setSelectedConversation(conversation);

    try {
      const history = await getMessages(
        conversation.id
      );

      if (Array.isArray(history)) {
        setMessages(history);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    if (
      !socket.current ||
      socket.current.readyState !== WebSocket.OPEN
    ) {
      alert("Socket not connected");
      return;
    }

    let receiverId;

    if (
      Number(selectedConversation.client_id) ===
      Number(userId)
    ) {
      receiverId =
        selectedConversation.freelancer_id;
    } else {
      receiverId =
        selectedConversation.client_id;
    }

    socket.current.send(
      JSON.stringify({
        receiver_id: receiverId,
        message: input,
      })
    );

 

    setInput("");
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">

        <h1 className="text-5xl font-black tracking-wide">
          <span style={{ color: "cyan" }}>
            Freelance
          </span>

          <span className="text-white">
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
            {user
              ? user.name?.charAt(0).toUpperCase()
              : "U"}
          </div>

        </div>

      </nav>

      <section className="relative z-10 px-8 py-10">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-black mb-3">
            Messages
          </h2>

          <p className="text-gray-400 mb-10">
            Chat with freelancers, discuss project updates and milestones.
          </p>

          <div className="grid grid-cols-12 gap-6 h-[75vh]">
            {/* Conversations List */}

            <div className="col-span-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden flex flex-col">

              <div className="p-5 border-b border-white/10">

                <h3 className="text-xl font-bold">
                  Conversations
                </h3>

              </div>

              <div className="flex-1 overflow-y-auto">

                {conversations.length === 0 ? (

                  <div className="p-5 text-gray-400">
                    No conversations yet.
                  </div>

                ) : (

                  conversations.map((conv) => (

                    <div
                      key={conv.id}
                      onClick={() => openConversation(conv)}
                      className={`

                        cursor-pointer
                        p-5
                        border-b
                        border-white/5
                        transition
                        hover:bg-white/5

                        ${selectedConversation?.id === conv.id
                          ? "bg-white/10"
                          : ""
                        }

                      `}
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className="
                            h-12
                            w-12
                            rounded-full
                            bg-[#1424ff]
                            flex
                            items-center
                            justify-center
                            font-bold
                          "
                        >

                          {conv.client_id === userId
                            ? "F"
                            : "C"}

                        </div>

                        <div className="flex-1">

                          <h4 className="font-semibold">
                            Conversation #{conv.id}
                          </h4>

                          <p className="text-sm text-gray-400 truncate">
                            {conv.last_message
                              ? conv.last_message
                              : "Start chatting"}
                          </p>

                        </div>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

            {/* Chat Window */}

            <div
              className="
                col-span-8
                bg-white/5
                border
                border-white/10
                rounded-3xl
                backdrop-blur-xl
                flex
                flex-col
              "
            >

              <div className="p-5 border-b border-white/10">

                <h3 className="text-xl font-bold">

                  {selectedConversation
                    ? `Conversation #${selectedConversation.id}`
                    : "Select a Conversation"}

                </h3>

              </div>

              {/* Messages */}

              <div
                className="
                  flex-1
                  overflow-y-auto
                  p-6
                  space-y-4
                "
              >
                {messages.length === 0 ? (

                  <div className="flex h-full items-center justify-center text-gray-500">
                    No messages yet.
                  </div>

                ) : (

                  messages.map((msg) => {

                    const isMine =
                      Number(msg.sender_id) === Number(userId);

                    return (

                      <div
                        key={msg.id}
                        className={`flex ${isMine
                            ? "justify-end"
                            : "justify-start"
                          }`}
                      >

                        <div
                          className={`
                            max-w-[70%]
                            rounded-2xl
                            px-5
                            py-3
                            ${isMine
                              ? "bg-[#1424ff] text-white"
                              : "bg-white/10 text-white"
                            }
                          `}
                        >

                          <p className="text-xs opacity-70 mb-2">

                            {isMine
                              ? "You"
                              : "Freelancer"}

                          </p>

                          <p className="break-words whitespace-pre-wrap">

                            {msg.content}

                          </p>

                        </div>

                      </div>

                    );

                  })

                )}

                <div ref={messagesEndRef} />

              </div>

              {/* Bottom Input */}

              {selectedConversation ? (

                <div className="p-5 border-t border-white/10">

                  <div className="flex gap-4">

                    <input
                      type="text"
                      value={input}
                      onChange={(e) =>
                        setInput(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          sendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="
                        flex-1
                        rounded-2xl
                        bg-black/20
                        border
                        border-white/10
                        px-5
                        py-4
                        outline-none
                        focus:border-[#1424ff]
                      "
                    />

                    <button
                      onClick={sendMessage}
                      className="
                        px-8
                        py-4
                        rounded-2xl
                        bg-[#1424ff]
                        hover:bg-blue-700
                        transition
                        font-bold
                      "
                    >
                      Send
                    </button>

                  </div>

                </div>

              ) : (

                <div className="flex flex-1 items-center justify-center text-gray-500">
                  Select a conversation to start chatting.
                </div>

              )}
            </div>

          </div>

        </div>

      </section>

    </main>
  );
} 