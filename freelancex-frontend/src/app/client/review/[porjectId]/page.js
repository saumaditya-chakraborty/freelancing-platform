"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectd;
  console.log("Params:", params);
  console.log("Project ID:", projectId);

  const [project, setProject] = useState(null);
  const [freelancer, setFreelancer] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  async function fetchProject() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load project.");
      }

      setProject(data);

      let freelancerData = null;

      if (data.accepted_proposal?.freelancer) {
        freelancerData = data.accepted_proposal.freelancer;
      } else if (data.freelancer) {
        freelancerData = data.freelancer;
      } else if (
        data.acceptedProposal &&
        data.acceptedProposal.freelancer
      ) {
        freelancerData = data.acceptedProposal.freelancer;
      }

      setFreelancer(freelancerData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(e) {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/reviews/project/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            comment,
          }),
        }
      );

      const data = await response.json();

console.log("Status:", response.status);
console.log("Response:", data);

if (!response.ok) {
    throw new Error(
        data.error || data.message || "Review submission failed."
    );
}

      alert("Review submitted successfully!");

      router.push("/client/projects");
    } catch (err) {
        console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }
    return (
    <div className="min-h-screen bg-[#0B1120] text-white flex justify-center items-center px-6 py-10">
      <div className="w-full max-w-2xl bg-[#111827] rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-8">
          Rate Freelancer
        </h1>

        <div className="space-y-4 mb-8">

          <div>
            <p className="text-gray-400 text-sm">Project</p>
            <p className="text-lg font-semibold">
              {project?.title || "Project"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Freelancer</p>
            <p className="text-lg font-semibold">
              {freelancer?.name || "Freelancer"}
            </p>
          </div>

        </div>

        <form onSubmit={submitReview} className="space-y-8">

          <div>
            <label className="block mb-3 text-lg font-medium">
              Rating
            </label>

            <StarRating
              rating={rating}
              setRating={setRating}
            />
          </div>

          <div>
            <label className="block mb-3 text-lg font-medium">
              Review
            </label>

            <textarea
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience working with this freelancer..."
              className="w-full rounded-lg bg-[#1F2937] border border-gray-700 p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 text-lg font-semibold disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>

        </form>

      </div>
    </div>
  );
}