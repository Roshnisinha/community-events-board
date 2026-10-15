import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();


    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const eventId =
      typeof body.eventId === "string" ? body.eventId.trim() : "";

    if (!name || !email || !eventId) {
      return NextResponse.json(
        { error: "Name, email, and event are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const registration = await prisma.registration.create({
      data: { name, email, eventId },
    });

    return NextResponse.json(
      { message: "Registration successful", registration },
      { status: 201 }
    );
   } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "You are already registered for this event with this email." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}