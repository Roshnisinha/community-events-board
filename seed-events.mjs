
import "dotenv/config";
import { PrismaClient } from "./app/generated/prisma/client.ts";
const prisma = new PrismaClient();

const events = [
  {
    title: "Live Music Evening",
    description: "Enjoy a memorable live music evening.",
    location: "Mumbai",
    startDate: new Date("2027-01-25T18:00:00"),
  },
  {
    title: "Creative Art Workshop",
    description: "Explore your creativity in an art workshop.",
    location: "Pune",
    startDate: new Date("2027-02-10T11:00:00"),
  },
  {
    title: "Street Food Festival",
    description: "Discover delicious street food.",
    location: "Nashik",
    startDate: new Date("2027-03-15T17:00:00"),
  },
  {
    title: "Weekend Football Match",
    description: "Enjoy an exciting football match.",
    location: "Mumbai",
    startDate: new Date("2027-04-05T16:00:00"),
  },
  {
    title: "Kids Fun Carnival",
    description: "A fun-filled carnival for kids.",
    location: "Pune",
    startDate: new Date("2027-05-12T10:00:00"),
  },
  {
    title: "Acoustic Night",
    description: "Relax with live acoustic music.",
    location: "Nashik",
    startDate: new Date("2027-06-20T19:00:00"),
  },
];

try {
  await prisma.event.createMany({ data: events });
  console.log("6 events added successfully!");
} catch (error) {
  console.error("Failed to add events:", error);
} finally {
  await prisma.$disconnect();
}
