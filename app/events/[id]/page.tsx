
import prisma from "../../../lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import RegistrationForm from "./RegistrationForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EventDetailsPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
          Loading event details...
        </main>
      }
    >
      <EventDetails params={params} />
    </Suspense>
  );
}

async function EventDetails({ params }: Props) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-orange-400 hover:text-orange-300"
        >
          ← Back to all events
        </Link>

        <article className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Event Details
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            {event.title}
          </h1>

          <p className="mt-6 text-slate-300">
            {event.description || "More details coming soon."}
          </p>

          <div className="mt-8 space-y-4">
            <p>
              <span className="text-slate-400">Location: </span>
              {event.location || "Location to be announced"}
            </p>

            <p>
              <span className="text-slate-400">Date: </span>
              {event.startDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
          </div>
        </article>

        <RegistrationForm eventId={event.id} />

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400"
        >
          Explore more events
        </Link>
      </div>
    </main>
  );
}
