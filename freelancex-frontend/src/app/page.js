import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,#0f172a_35%,#000000_75%)]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">
       <h1 className="text-5xl font-black tracking-wide">
  <span
    style={{
      color: "cyan",
    }}
  >
    Freelance
  </span>

  <span
    className="text-white"
  >
    X
  </span>
</h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28">
        <div className="max-w-6xl">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Freelancing Reimagined
          </div>

          <h1 className="mt-8 text-6xl md:text-8xl font-black leading-none">
            Build Great .
            <br />
            Hire Best .
            <br />
            Scale Larger.
          </h1>

          <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto">
            FreelanceX connects ambitious clients with world-class freelancers.
            Manage projects, milestones, payments, proposals and real-time
            collaboration in one place.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Hiring
            </Link>

            <Link
              href="/register"
              className="px-8 py-4 border border-white/20 rounded-2xl text-lg font-semibold hover:bg-white/10 transition"
            >
              Become a Freelancer
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mt-24 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h2 className="text-5xl font-black text-blue-400">100+</h2>
            <p className="mt-3 text-gray-300">Projects Posted</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h2 className="text-5xl font-black text-blue-400">50+</h2>
            <p className="mt-3 text-gray-300">Active Freelancers</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h2 className="text-5xl font-black text-blue-400">24/7</h2>
            <p className="mt-3 text-gray-300">Collaboration</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-28 px-8">
        <h2 className="text-center text-5xl font-black mb-16">
          Everything You Need
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-5">
              Clients
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>Post Projects</li>
              <li>Manage Milestones</li>
              <li>Track Payments</li>
              <li>Review Freelancers</li>
              <li>Hire Top Talent</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-5">
              Freelancers
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>Browse Projects</li>
              <li>Submit Proposals</li>
              <li>Earn Through Milestones</li>
              <li>Build Reputation</li>
              <li>Get Paid Faster</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-5">
              Platform
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>JWT Authentication</li>
              <li>Real-Time Messaging</li>
              <li>Payment Tracking</li>
              <li>Review System</li>
              <li>Admin Controls</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-8 pb-24">
        <div className="max-w-6xl mx-auto rounded-[40px] border border-white/10 bg-white/5 p-14 text-center backdrop-blur-xl">
          <h2 className="text-5xl font-black">
            Ready to launch your next project?
          </h2>

          <p className="mt-5 text-gray-300 text-lg">
            Join FreelanceX and connect with professionals worldwide.
          </p>

          <Link
            href="/register"
            className="inline-block mt-8 px-10 py-4 bg-blue-600 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-gray-500">
        © 2026 FreelanceX • Built with Next.js + Golang + PostgreSQL
      </footer>
    </main>
  );
}