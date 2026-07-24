"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getProposals,
    deleteProposal
} from "@/services/adminService";

export default function AdminProposals() {

    const router = useRouter();

    const [proposals, setProposals] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!localStorage.getItem("token")) {
            router.replace("/admin/login");
            return;
        }

        load();

    }, []);

    async function load() {

        try {

            const data = await getProposals();

            setProposals(data.proposals || data);

        }
        finally {

            setLoading(false);

        }

    }

    async function remove(id) {

        if (!confirm("Delete Proposal?")) return;

        await deleteProposal(id);

        load();

    }

    if (loading) {

        return (

            <main className="min-h-screen bg-black text-white flex justify-center items-center">

                Loading...

            </main>

        );

    }

    return (

        <main className="min-h-screen bg-black text-white">

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#450000_0%,#160000_30%,#050505_70%,#000000_100%)]" />

            <div className="relative z-10 p-10">

                <div className="flex justify-between">

                    <h1 className="text-5xl font-black">

                        Proposal Management

                    </h1>

                    <button

                        onClick={() => router.push("/admin/dashboard")}

                        className="bg-red-700 px-6 py-3 rounded-xl"

                    >

                        Dashboard

                    </button>

                </div>

                <div className="mt-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-red-900/30">

                            <tr>

                                <th className="p-5 text-left">ID</th>

                                <th className="p-5 text-left">Freelancer</th>

                                <th className="p-5 text-left">Bid</th>

                                <th className="p-5 text-left">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                proposals.map(proposal => (

                                    <tr

                                        key={proposal.id}

                                        className="border-t border-white/10"

                                    >

                                        <td className="p-5">

                                            {proposal.id}

                                        </td>

                                        <td className="p-5">

                                            {proposal.freelancer_id}

                                        </td>

                                        <td className="p-5">

                                            ₹{proposal.bid_amount}

                                        </td>

                                        <td className="p-5">

                                            <button

                                                onClick={() => remove(proposal.id)}

                                                className="bg-red-700 px-4 py-2 rounded-lg"

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