"use client";

import { useState } from "react";

export default function RegistrationForm({ eventId }: { eventId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setMessage("Registration successful!");
      setName("");
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-slate-900 p-6 text-white"
    >
      <h2 className="text-2xl font-bold">Register for this event</h2>

      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-lg bg-slate-800 p-3"
      />

      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full rounded-lg bg-slate-800 p-3"
      />

      <button
        disabled={loading}
        type="submit"
        className="rounded-lg bg-orange-500 px-5 py-3 font-semibold disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}
