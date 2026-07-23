"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";

export default function FreelancerReviewsPage() {

    const params = useParams();
    const router = useRouter();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    async function fetchReviews() {

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:8080/reviews/freelancer/${params.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            console.log(data);

            if (Array.isArray(data)) {
                setReviews(data);
            } else {
                setReviews([]);
            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }
      return (
    <main className="min-h-screen bg-black text-white px-8 py-10">

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-5xl font-black">
              Freelancer Reviews
            </h1>

            <p className="text-gray-400 mt-2">
              Total Reviews: {reviews.length}
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              transition
              font-semibold
            "
          >
            ← Back
          </button>

        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">
              Loading reviews...
            </p>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-3">
              No Reviews Yet
            </h2>

            <p className="text-gray-400">
              This freelancer has not received any reviews.
            </p>
          </div>
        )}

        <div className="space-y-6">

          {reviews.map((review) => (

            <div
              key={review.id}
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-8
                backdrop-blur-xl
              "
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-2xl font-bold">
                    {review.client_name}
                  </h2>

                  <p className="text-gray-400 mt-1">
                    Project: {review.project_name}
                  </p>

                </div>

                <span className="text-gray-400">
                  {review.created_at}
                </span>

              </div>

              <div className="mt-5">
                <StarRating
                  rating={review.rating}
                  editable={false}
                  size={24}
                />
              </div>

              <div className="mt-6 bg-black/20 rounded-2xl p-6">

                <h3 className="font-semibold mb-3">
                  Review
                </h3> 

                <p className="text-gray-300 leading-relaxed">
                  {review.comment}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );

}
