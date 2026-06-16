"use client";

import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link href="/" className="brand">FreelanceX</Link>

      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/dashboard">Dashboard</Link>
        {user ? (
          <button className="nav-button" onClick={logout}>Logout</button>
        ) : (
          <>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

