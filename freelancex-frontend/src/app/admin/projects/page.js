"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getProjects,
    deleteProject
} from "@/services/adminService";

export default function AdminProjects() {

    const router = useRouter();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!localStorage.getItem("token")) {
            router.replace("/admin/login");
            return;
        }

        loadProjects();

    }, []);

    async function loadProjects() {

        try {

            const data = await getProjects();

            setProjects(data.projects || data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    }

    async function removeProject(id) {

        const ok = confirm("Delete this project?");

        if (!ok) return;

        await deleteProject(id);

        loadProjects();

    }

    if (loading) {

        return (

            <main className="min-h-screen bg-black text-white flex items-center justify-center">

                Loading Projects...

            </main>

        );

    }

    return (

        <main className="min-h-screen bg-black text-white">

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#450000_0%,#160000_30%,#050505_70%,#000000_100%)]" />

            <div className="relative z-10 p-10">

                <div className="flex justify-between">

                    <h1 className="text-5xl font-black">

                        Project Management

                    </h1>

                    <button

                        onClick={() => router.push("/admin/dashboard")}

                        className="bg-red-700 px-6 py-3 rounded-xl hover:bg-red-800"

                    >

                        Dashboard

                    </button>

                </div>

                <div className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-red-900/30">

                            <tr>

                                <th className="text-left p-5">ID</th>

                                <th className="text-left p-5">Title</th>

                                <th className="text-left p-5">Budget</th>

                                <th className="text-left p-5">Status</th>

                                <th className="text-left p-5">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                projects.map(project => (

                                    <tr

                                        key={project.id}

                                        className="border-t border-white/10 hover:bg-white/5"

                                    >

                                        <td className="p-5">

                                            {project.id}

                                        </td>

                                        <td className="p-5">

                                            {project.title}

                                        </td>

                                        <td className="p-5">

                                            ₹{project.budget}

                                        </td>

                                        <td className="p-5">

                                            {project.status}

                                        </td>

                                        <td className="p-5">

                                            <button

                                                onClick={() => removeProject(project.id)}

                                                className="bg-red-700 px-4 py-2 rounded-lg hover:bg-red-800"

                                            >

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </main>

    );

}