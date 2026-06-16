export default function Home() {
  return (
    <section className="home-shell">
      <div className="hero">
        <p className="eyebrow">FreelanceX marketplace</p>
        <h1>Hire trusted freelancers and manage paid milestones in one place.</h1>
        <p>
          Post client projects, submit proposals, accept freelancers, and move
          milestone payments through wallet escrow.
        </p>
        <div className="hero-actions">
          <a className="btn-primary" href="/projects">Browse Projects</a>
          <a className="btn-secondary" href="/register">Create Account</a>
        </div>
      </div>
      <div className="feature-row">
        <div>
          <strong>Projects</strong>
          <span>Publish work with budgets and status tracking.</span>
        </div>
        <div>
          <strong>Proposals</strong>
          <span>Freelancers bid, clients accept, others are rejected.</span>
        </div>
        <div>
          <strong>Escrow</strong>
          <span>Funds are held and released through milestones.</span>
        </div>
      </div>
    </section>
  );
}
