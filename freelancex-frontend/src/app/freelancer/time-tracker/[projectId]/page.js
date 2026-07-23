
"use client";

import { useParams } from "next/navigation";
import TimeTracker from "@/components/TimeTracker";

export default function TimeTrackerPage() {

    const { projectId } = useParams();

    return (
        <main className="min-h-screen bg-black text-white p-10">

            <h1 className="text-4xl font-bold mb-8">
                Time Tracker
            </h1>

            <TimeTracker projectId={projectId} />

        </main>
    );
}