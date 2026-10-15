
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.startDate) {
      return NextResponse.json(
        { error: "Title and start date are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description || null,
        location: body.location || null,
        startDate: new Date(body.startDate),
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
