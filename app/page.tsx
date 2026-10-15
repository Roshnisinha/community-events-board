
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: string;
};

type DisplayEvent = Event & {
  city: string;
  date: string;
  emoji: string;
  category: string;
  price: number;
};

const eventDetails: Record<
  string,
  { emoji: string; category: string; price: number }
> = {
  "Live Music Evening": { emoji: "🎵", category: "Music", price: 499 },
  "Creative Art Workshop": { emoji: "🎨", category: "Workshop", price: 299 },
  "Street Food Festival": { emoji: "🍜", category: "Food", price: 199 },
  "Weekend Football Match": { emoji: "⚽", category: "Sports", price: 150 },
  "Kids Fun Carnival": { emoji: "🧸", category: "Kids", price: 250 },
  "Acoustic Night": { emoji: "🎸", category: "Music", price: 399 },
};

const categories = ["All", "Music", "Workshop", "Food", "Sports", "Kids"];

export default function Home() {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All");

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data: Event[] = await response.json();

        setEvents(
          data.map((event) => ({
            ...event,
            city: event.location ?? "",
            date: event.startDate,
            ...(eventDetails[event.title] ?? {
              emoji: "📅",
              category: "Other",
              price: 0,
            }),
          }))
        );
      } catch {
        setError("Unable to load events. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      category === "All" || event.category === category;
    const matchesCity = city === "All" || event.city === city;
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.city.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesCity && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
        <h1 className="text-2xl font-bold">
          gather<span className="text-orange-400">.</span>
        </h1>
        <button className="rounded-full bg-orange-500 px-5 py-2 font-semibold">
          Log in
        </button>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-4 font-semibold uppercase tracking-[0.25em] text-orange-400">
          Discover your next experience
        </p>

        <h2 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
          Good things happen when we{" "}
          <span className="text-orange-400">gather.</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg text-slate-300">
          Find local events, meet new people, and make your free time memorable.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events or cities..."
            className="rounded-xl border border-white/10 bg-white/10 px-5 py-4 outline-none focus:border-orange-400"
          />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900 px-5 py-4 outline-none"
          >
            <option value="All">All cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Nashik">Nashik</option>
          </select>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2 font-medium transition ${
                category === item
                  ? "bg-orange-500 text-white"
                  : "border border-white/15 text-slate-300 hover:border-orange-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-12 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold">Explore events</h3>
            <p className="mt-2 text-slate-400">
              Find something you will love.
            </p>
          </div>
          <span className="text-sm text-slate-400">
            {filteredEvents.length} events
          </span>
        </div>

        {loading ? (
          <p className="mt-8 text-slate-400">Loading events...</p>
        ) : error ? (
          <p className="mt-8 text-red-400">{error}</p>
        ) : filteredEvents.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 p-10 text-center">
            <p className="text-xl font-semibold">No events found</p>
            <p className="mt-2 text-slate-400">
              Try another category, city, or search term.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setCity("All");
              }}
              className="mt-5 rounded-full bg-orange-500 px-5 py-2 font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 transition hover:-translate-y-1 hover:border-orange-400/50"
              >
                <div className="flex h-36 items-center justify-center rounded-xl bg-black/20 text-6xl">
                  {event.emoji}
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-orange-400">
                  {event.category}
                </p>

                <h4 className="mt-2 text-xl font-bold">{event.title}</h4>
                <p className="mt-2 text-sm text-slate-300">
                  📍 {event.city}
                </p>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </span>
                  <span className="font-semibold text-orange-400">
                    {event.price === 0
                      ? "Free"
                      : `₹${event.price.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="mt-5 block w-full rounded-lg border border-white/15 px-4 py-3 text-center font-medium hover:bg-white/10"
                >
                  View event →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
