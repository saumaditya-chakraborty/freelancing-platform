"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import ProjectCard from "../../components/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", budget: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const data = await api.get("/projects");
        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  async function createProject(e) {
    e.preventDefault();
    setError("");

    try {
      const project = await api.post("/projects", {
        ...form,
        budget: Number(form.budget),
      });
      setProjects([project, ...projects]);
      setForm({ title: "", description: "", budget: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page-grid">
      <div>
        <div className="page-header">
          <div>
            <h1>Projects</h1>
            <p>Browse open work and publish new client projects.</p>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        {isLoading ? (
          <p className="muted">Loading projects...</p>
        ) : (
          <div className="project-grid">
            {projects.length === 0 ? (
              <p className="muted">No projects yet.</p>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  client={project.client_id}
                  budget={`$${project.budget}`}
                  status={project.status}
                />
              ))
            )}
          </div>
        )}
      </div>

      <aside className="side-panel">
        <h2>Post a Project</h2>
        <form onSubmit={createProject} className="form-stack">
          <label className="label" htmlFor="title">Title</label>
          <input
            id="title"
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="input textarea"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <label className="label" htmlFor="budget">Budget</label>
          <input
            id="budget"
            className="input"
            type="number"
            min="1"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            required
          />

          <button className="btn-primary">Create Project</button>
        </form>
      </aside>
    </section>
  );
}
