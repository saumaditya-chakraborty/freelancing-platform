export default function ProjectCard({ title, client, budget, status, description }) {
  return (
    <article className="project-card">
      <h2 className="project-title">{title}</h2>
      {description && <p className="project-description">{description}</p>}
      <div className="project-meta">
        {client && <span>Client #{client}</span>}
        <span>{budget}</span>
      </div>
      <span className={`badge badge-${status || "open"}`}>{status || "open"}</span>
    </article>
  );
}
