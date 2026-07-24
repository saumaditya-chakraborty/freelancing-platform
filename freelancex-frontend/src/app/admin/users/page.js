"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getUsers,
    blockUser,
    unblockUser,
    banUser
} from "@/services/adminService";

export default function AdminUsers() {

    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/admin/login");
            return;
        }

        loadUsers();

    }, []);

    async function loadUsers() {

        try {

            const data = await getUsers();

              setUsers(data.users || data);
               setFilteredUsers(data.users || data);
        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    }

    function handleSearch(value) {

        setSearch(value);

        const filtered = users.filter((user) =>

            (user.name || "")
                .toLowerCase()
                .includes(value.toLowerCase()) ||

            (user.email || "")
                .toLowerCase()
                .includes(value.toLowerCase()) ||

            (user.role || "")
                .toLowerCase()
                .includes(value.toLowerCase())

        );

        setFilteredUsers(filtered);

    }

    if (loading) {

        return (

            <main className="min-h-screen bg-black flex justify-center items-center text-white">

                Loading Users...

            </main>

        );

    }

    return (

        <main className="min-h-screen bg-black text-white overflow-hidden">

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#450000_0%,#160000_30%,#050505_70%,#000000_100%)]" />

            <div className="relative z-10 p-10">

                <div className="flex justify-between items-center">

                    <div>

                        <h1 className="text-5xl font-black">

                            User Management

                        </h1>

                        <p className="text-gray-400 mt-2">

                            Manage all registered users

                        </p>

                    </div>

                    <button

                        onClick={() => router.push("/admin/dashboard")}

                        className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-xl"

                    >

                        Dashboard

                    </button>

                </div>

                <div className="mt-8">

                    <input

                        value={search}

                        onChange={(e) => handleSearch(e.target.value)}

                        placeholder="Search by name, email or role..."

                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 backdrop-blur-xl"

                    />

                </div>

                <div className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-red-900/30">

                            <tr>

                                <th className="text-left px-6 py-5">ID</th>
                                <th className="text-left px-6 py-5">Name</th>
                                <th className="text-left px-6 py-5">Email</th>
                                <th className="text-left px-6 py-5">Role</th>
                                <th className="text-left px-6 py-5">Status</th>
                                <th className="text-left px-6 py-5">Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredUsers.map((user) => (

                                <tr

                                    key={user.id}

                                    className="border-t border-white/10 hover:bg-white/5"

                                >

                                    <td className="px-6 py-5">

                                        {user.id}

                                    </td>

                                    <td className="px-6 py-5">

                                        {user.name}

                                    </td>

                                    <td className="px-6 py-5">

                                        {user.email}

                                    </td>

                                    <td className="px-6 py-5 capitalize">

                                        {user.role}

                                    </td>

                                    <td className="px-6 py-5">

                                        {user.is_banned ? (

                                            <span className="bg-red-700 px-3 py-1 rounded-lg">

                                                Banned

                                            </span>

                                        ) : user.is_blocked ? (

                                            <span className="bg-yellow-600 px-3 py-1 rounded-lg">

                                                Blocked

                                            </span>

                                        ) : (

                                            <span className="bg-green-600 px-3 py-1 rounded-lg">

                                                Active

                                            </span>

                                        )}

                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex gap-2 flex-wrap">

                                            {!user.is_blocked && !user.is_banned && (

                                                <button

                                                    onClick={async () => {

                                                        await blockUser(user.id);

                                                        loadUsers();

                                                    }}

                                                    className="px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition"

                                                >

                                                    Block

                                                </button>

                                            )}

                                            {user.is_blocked && !user.is_banned && (

                                                <button

                                                    onClick={async () => {

                                                        await unblockUser(user.id);

                                                        loadUsers();

                                                    }}

                                                    className="px-3 py-2 rounded-lg bg-green-700 hover:bg-green-800 transition"

                                                >

                                                    Unblock

                                                </button>

                                            )}

                                            {!user.is_banned && (

                                                <button

                                                    onClick={async () => {

                                                        const ok = confirm(
                                                            "Ban this user?"
                                                        );

                                                        if (!ok) return;

                                                        await banUser(user.id);

                                                        loadUsers();

                                                    }}

                                                    className="px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition"

                                                >

                                                    Ban

                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </main>

    );

}