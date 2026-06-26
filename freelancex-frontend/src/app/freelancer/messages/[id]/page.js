"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function FreelancerChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef(null);

const clientId = Number(searchParams.get("client"));
const freelancerId = Number(searchParams.get("freelancer"));


  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  

  const socket = useRef(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

      useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  useEffect(() => {
    fetchMessages();
    connectSocket();

    return () => {
      socket.current?.close();
    };
  }, []);

  const connectSocket = () => {
    console.log("Connecting WebSocket...");

    socket.current = new WebSocket(
      `ws://localhost:8080/ws/${params.id}/${user.id}`
    );

    socket.current.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    socket.current.onmessage = (event) => {
      console.log("Incoming websocket:", event.data);
      const msg = JSON.parse(event.data);

      console.log("📩 Incoming:", msg);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          content: msg.message,
        },
      ]);
    };

    socket.current.onerror = (err) => {
      console.log("❌ WebSocket Error:", err);
    };

    socket.current.onclose = () => {
      console.log("❌ WebSocket Closed");
    };
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/messages/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("Messages:", data);

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }

    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    if (
      !socket.current ||
      socket.current.readyState !== WebSocket.OPEN
    ) {
      alert("Socket not connected");
      return;
    }


     const receiverId =
  Number(user.id) === clientId
    ? freelancerId
    : clientId;

    socket.current.send(
      JSON.stringify({
        receiver_id: receiverId,
        message: message,
      })
    );

   

    setMessage("");
  };
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      <div className="relative z-10 max-w-5xl mx-auto h-screen flex flex-col">

        {/* Header */}

        <div className="border-b border-white/10 p-6">

          <h1 className="text-3xl font-black">
            Conversation #{params.id}
          </h1>

        </div>

        {/* Messages */}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.length === 0 && (

            <div className="text-center text-gray-500 mt-20">
              No messages yet.
            </div>

          )}

          {messages.map((msg) => (

            <div
              key={msg.id}
              className={`flex ${Number(msg.sender_id) === Number(user.id)
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
                  ${Number(msg.sender_id) === Number(user.id)
                    ? "bg-[#1424ff]"
                    : "bg-white/10"
                  }
                `}
              >

                <p className="text-sm text-gray-300">
                  User {msg.sender_id}
                </p>

                <p className="mt-2 break-words">
                  {msg.content}
                </p>

              </div>

            </div>

          ))}
          <div ref={messagesEndRef} />

        </div>

        {/* Bottom Input */}

        <div className="border-t border-white/10 p-6">

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="
                flex-1
                bg-white/5
                border
                border-white/10
                rounded-xl
                px-5
                py-3
                outline-none
              "
            />
            <button
              onClick={sendMessage}
              className="
                px-8
                py-3
                rounded-xl
                bg-[#1424ff]
                hover:bg-blue-700
                transition
                font-semibold
              "
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}