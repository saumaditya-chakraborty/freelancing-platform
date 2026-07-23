"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  getMyPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/services/portfolio";

export default function PortfolioPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [portfolio, setPortfolio] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    project_id: "",
    title: "",
    description: "",
    github_url: "",
    demo_url: "",
    image_url: "",
    technologies: "",
  });

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    fetchPortfolio();

  }, []);

  async function fetchPortfolio() {

    try {

      const data = await getMyPortfolio();

      setPortfolio(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }

  function resetForm() {

    setEditingId(null);

    setForm({
      project_id: "",
      title: "",
      description: "",
      github_url: "",
      demo_url: "",
      image_url: "",
      technologies: "",
    });

  }

  if (loading) {

    return (

      <main className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">

        Loading Portfolio...

      </main>

    );

  }

  return (

    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Background */}

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* Navbar */}

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">

        <h1 className="text-5xl font-black tracking-wide">

          <span style={{ color: "cyan" }}>

            Freelance

          </span>

          <span className="text-white">

            X

          </span>

        </h1>

        <div className="flex gap-5">
            

          <Link
            href="/freelancer/dashboard"
            className="hover:text-cyan-400 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/freelancer/projects"
            className="hover:text-cyan-400 transition"
          >
            Projects
          </Link>

          <Link
            href="/freelancer/messages"
            className="hover:text-cyan-400 transition"
          >
            Messages
          </Link>

          <Link
            href="/freelancer/portfolio"
            className="text-cyan-400 font-bold"
          >
            Portfolio
          </Link>

        </div>

      </nav>

      {/* Header */}

      <section className="relative z-10 px-8 pt-12">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-black">

            My Portfolio

          </h2>

          <p className="mt-4 text-gray-300 text-lg">

            Showcase your projects and impress future clients.

          </p>

        </div>

      </section>
            {/* Add Portfolio */}

      <section className="relative z-10 px-8 mt-12">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <h2 className="text-3xl font-black mb-8">
              {editingId ? "Update Portfolio" : "Add New Portfolio"}
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                try {

                  if (editingId) {

                    await updatePortfolio(editingId, form);

                  } else {

                    await createPortfolio({
                      ...form,
                      project_id: Number(form.project_id),
                    });

                  }

                  resetForm();
                  fetchPortfolio();

                } catch (err) {

                  console.error(err);
                  alert("Operation Failed");

                }
              }}
            >

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <label className="text-gray-300 block mb-2">
                    Project ID
                  </label>

                  <input
                    type="number"
                    name="project_id"
                    value={form.project_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                  />

                </div>

                <div>

                  <label className="text-gray-300 block mb-2">
                    Project Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                  />

                </div>

              </div>

              <div className="mt-6">

                <label className="text-gray-300 block mb-2">
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                />

              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                <div>

                  <label className="text-gray-300 block mb-2">
                    GitHub URL
                  </label>

                  <input
                    type="text"
                    name="github_url"
                    value={form.github_url}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                  />

                </div>

                <div>

                  <label className="text-gray-300 block mb-2">
                    Live Demo URL
                  </label>

                  <input
                    type="text"
                    name="demo_url"
                    value={form.demo_url}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                  />

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                <div>

                  <label className="text-gray-300 block mb-2">
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                  />

                </div>

                <div>

                  <label className="text-gray-300 block mb-2">
                    Technologies
                  </label>

                  <input
                    type="text"
                    name="technologies"
                    value={form.technologies}
                    onChange={handleChange}
                    placeholder="React, Go, PostgreSQL"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                  />

                </div>

              </div>

              <div className="flex gap-4 mt-8">

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#1424ff] hover:bg-blue-700 transition font-bold"
                >
                  {editingId
                    ? "Update Portfolio"
                    : "Add Portfolio"}
                </button>

                {editingId && (

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>

                )}

              </div>

            </form>

          </div>

        </div>

      </section>
            {/* Portfolio Projects */}

      <section className="relative z-10 px-8 py-14">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-black mb-8">

            Portfolio Projects

          </h2>

          {portfolio.length === 0 ? (

            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl text-center">

              <h3 className="text-2xl font-bold">

                No Portfolio Projects Yet

              </h3>

              <p className="mt-4 text-gray-400">

                Add your first portfolio project to showcase your skills.

              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {portfolio.map((item) => (

                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:scale-[1.02] transition duration-300"
                >

                  {item.image_url ? (

                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-56 w-full object-cover"
                    />

                  ) : (

                    <div className="h-56 bg-gradient-to-br from-[#1424ff]/40 to-black flex items-center justify-center">

                      <span className="text-6xl">

                        💼

                      </span>

                    </div>

                  )}

                  <div className="p-6">

                    <div className="flex justify-between items-center">

                      <h3 className="text-2xl font-bold">

                        {item.title}

                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.status === "verified"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    <p className="text-gray-400 mt-4">

                      {item.description}

                    </p>

                    <div className="mt-5">

                      <p className="text-cyan-300 font-semibold">

                        Technologies

                      </p>

                      <p className="text-gray-300 mt-1">

                        {item.technologies}

                      </p>

                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">

                      {item.github_url && (

                        <a
                          href={item.github_url}
                          target="_blank"
                          className="px-4 py-2 rounded-xl bg-[#1424ff] hover:bg-blue-700 transition"
                        >
                          GitHub
                        </a>

                      )}

                      {item.demo_url && (

                        <a
                          href={item.demo_url}
                          target="_blank"
                          className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
                        >
                          Live Demo
                        </a>

                      )}

                    </div>

                    <div className="flex gap-4 mt-8">

                      <button
                        onClick={() => {

                          setEditingId(item.id);

                          setForm({

                            project_id: item.project_id,
                            title: item.title,
                            description: item.description,
                            github_url: item.github_url,
                            demo_url: item.demo_url,
                            image_url: item.image_url,
                            technologies: item.technologies,

                          });

                          window.scrollTo({

                            top: 0,
                            behavior: "smooth",

                          });

                        }}
                        className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 transition font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {

                          if (
                            !confirm(
                              "Delete this portfolio?"
                            )
                          )
                            return;

                          await deletePortfolio(item.id);

                          fetchPortfolio();

                        }}
                        className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* Footer */}

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-gray-500">

        © 2026 FreelanceX

      </footer>

    </main>

  );

}