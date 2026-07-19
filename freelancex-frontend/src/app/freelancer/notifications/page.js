"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const router = useRouter();

export default function NotificationsPage() {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {

        const token = localStorage.getItem("token");

        const res = await fetch(
            "http://localhost:8080/notifications",
            {
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        console.log(data);

        setNotifications(data);

    };

    const markRead = async (id) => {

    const token = localStorage.getItem("token");

    await fetch(
        `http://localhost:8080/notifications/${id}/read`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    setNotifications(
        notifications.map((n) =>
            n.ID === id
                ? { ...n, is_read: true }
                : n
        )
    );
};

 return (
  <main className="min-h-screen bg-black text-white">

    {/* Background */}
    <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

    <div className="relative z-10 max-w-6xl mx-auto px-8 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-12">

        <div>

          <h1 className="text-5xl font-black">
            Notifications
          </h1>

          <p className="text-gray-400 mt-3">
            Stay updated with your projects and assignments.
          </p>

        </div>

        <div
          className="
          bg-[#1424ff]
          rounded-3xl
          px-8
          py-5
          text-center
          shadow-lg
          "
        >

          <p className="text-gray-300 text-sm">
            Unread
          </p>

          <p className="text-4xl font-black">
            {notifications.filter(n => !n.is_read).length}
          </p>

        </div>

      </div>

      {/* Empty State */}

      {notifications.length === 0 ? (

        <div
          className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-16
          text-center
          backdrop-blur-xl
          "
        >

          <div className="text-6xl mb-5">
            🔔
          </div>

          <h2 className="text-3xl font-bold">
            No Notifications
          </h2>

          <p className="text-gray-400 mt-4">
            You're all caught up.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {notifications.map((notification) => (

            <div
              key={notification.ID}
              className={`
              rounded-3xl
              border
              backdrop-blur-xl
              p-8
              transition
              hover:scale-[1.01]
              ${
                notification.is_read
                  ? "bg-white/5 border-white/10 opacity-70"
                  : "bg-blue-500/10 border-blue-500"
              }
              `}
            >

              <div className="flex justify-between">

                <div className="flex gap-5">

                  <div
                    className="
                    h-14
                    w-14
                    rounded-full
                    bg-[#1424ff]
                    flex
                    items-center
                    justify-center
                    text-2xl
                    "
                  >
                  
                  </div>

                  <div>

                    <h2 className="text-2xl font-bold">
                      {notification.title}
                    </h2>

                   <p className="text-gray-300 mt-3 leading-relaxed">
  Your proposal for{" "}
  <span className="text-cyan-400 font-bold">
    {notification.project_name}
  </span>{" "}
  has been accepted.

  <br />

  You have been assigned this project.

  <br />

  Please get in touch with{" "}
  <span className="text-blue-400 font-bold">
    {notification.client_name}
  </span>{" "}
  for further project details, milestones and timeline.
</p>

                  </div>

                </div>

                {!notification.is_read && (

                  <div
                    className="
                    h-4
                    w-4
                    rounded-full
                    bg-green-400
                    mt-2
                    "
                  />

                )}

              </div>

              <div className="mt-8 flex justify-between items-center">

                <p className="text-gray-500 text-sm">

             

                </p>

                {!notification.is_read && (

                  <button
                    onClick={() => markRead(notification.ID)}
                    className="
                    px-6
                    py-2
                    rounded-xl
                    bg-[#1424ff]
                    hover:bg-blue-700
                    transition
                    font-semibold
                    "
                  >

                    Mark as Read

                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  </main>
);

}