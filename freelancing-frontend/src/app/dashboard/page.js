"use client";
import { useContext, useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import { AuthContext } from "../../context/AuthContext";
import api from "../../lib/api";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const projectData = await api.get("/projects");
        setProjects(projectData.slice(0, 3));

        if (user) {
          setWallet(await api.get("/wallet/"));
        }
      } catch (err) {
        setError(err.message);
      }
    }

    loadDashboard();
  }, [user]);

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p>{user ? `Welcome back, ${user.name}` : "Login to manage protected workspace actions."}</p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="stats-grid">
        <div className="stat">
          <span>Visible Projects</span>
          <strong>{projects.length}</strong>
        </div>
        <div className="stat">
          <span>Wallet Balance</span>
          <strong>{wallet ? `$${wallet.balance}` : "$0"}</strong>
        </div>
        <div className="stat">
          <span>Escrow</span>
          <strong>{wallet ? `$${wallet.escrow}` : "$0"}</strong>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className="tab active">Active Projects</button>
        <button className="tab">Proposals</button>
        <button className="tab">Earnings</button>
        <button className="tab">Messages</button>
      </div>

      <div className="dashboard-content">
        {projects.length === 0 ? (
          <p className="muted">No projects available yet.</p>
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
    </div>
  );
}
