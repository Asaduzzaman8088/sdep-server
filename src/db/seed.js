import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import { connectDB, disconnectDB } from "./connect.js";

const initialEvents = [
  {
    title: "Winter Clothes Distribution 2026",
    description:
      "Join us to distribute warm jackets, sweaters, and shawls to underprivileged families and street dwellers preparing for the colder weeks ahead in Mirpur.",
    eventType: "Donation",
    thumbnail:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
    location: "Mirpur 10 Roundabout, Dhaka",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    capacity: 50,
    joinedCount: 12,
    createdBy: {
      id: "seed-org-1",
      name: "Dhaka Youth Care",
      email: "youthcare@dhaka.org",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    title: "Blanket Distribution for the Needy",
    description:
      "Night distribution drive targeting rickshaw pullers, open-sky dwellers, and elderly citizens in need of heavy thermal blankets.",
    eventType: "Donation",
    thumbnail:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
    location: "Town Hall, Mohammadpur, Dhaka",
    eventDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    capacity: 40,
    joinedCount: 18,
    createdBy: {
      id: "seed-org-2",
      name: "Warmth Foundation",
      email: "care@warmthbd.org",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    title: "Dhanmondi Lake Clean-Up Drive",
    description:
      "A morning dedicated to clearing plastic debris, discarded bottles, and waste along the walkway and waterways of Rabindra Sarobar and Dhanmondi Lake.",
    eventType: "Cleanup",
    thumbnail:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=900&q=80",
    location: "Rabindra Sarobar, Dhanmondi, Dhaka",
    eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    capacity: 60,
    joinedCount: 34,
    createdBy: {
      id: "seed-org-3",
      name: "Clean City Initiative",
      email: "hello@cleancity.org",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    title: "Urban Tree Plantation & Care Drive",
    description:
      "Planting indigenous shade trees and flowering plants across community parks and roadside verges to improve green cover and air quality.",
    eventType: "Plantation",
    thumbnail:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    location: "Sector 4 Park, Uttara, Dhaka",
    eventDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
    capacity: 45,
    joinedCount: 20,
    createdBy: {
      id: "seed-org-4",
      name: "Green Dhaka Brigade",
      email: "greendhaka@org.bd",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    title: "Warm Meals for Street Children",
    description:
      "Cooking and serving nutritious hot meals, fresh fruits, and clean drinking water to over 300 underprivileged children and laborers.",
    eventType: "Food Distribution",
    thumbnail:
      "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=900&q=80",
    location: "Farmgate Overbridge Area, Dhaka",
    eventDate: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000),
    capacity: 35,
    joinedCount: 15,
    createdBy: {
      id: "seed-org-5",
      name: "Sheba Kitchen",
      email: "food@shebakitchen.org",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    title: "Free Community Eye & Health Camp",
    description:
      "Partnering with volunteer doctors and optometrists to provide free blood pressure checks, basic medication, diabetes screening, and eye exams.",
    eventType: "Health Camp",
    thumbnail:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80",
    location: "Community Center, Lalbagh, Old Dhaka",
    eventDate: new Date(Date.now() + 41 * 24 * 60 * 60 * 1000),
    capacity: 70,
    joinedCount: 42,
    createdBy: {
      id: "seed-org-6",
      name: "MediShare BD",
      email: "info@medisharebd.org",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
    },
  },
];

async function seed() {
  await connectDB();
  const count = await Event.countDocuments();
  if (count === 0) {
    console.log("[seed] Seeding initial events to MongoDB Atlas...");
    await Event.insertMany(initialEvents);
    console.log(`[seed] Successfully inserted ${initialEvents.length} upcoming events.`);
  } else {
    console.log(`[seed] Database already contains ${count} events.`);
  }
  await disconnectDB();
}

seed().catch((err) => {
  console.error("[seed] Seeding error:", err);
  process.exit(1);
});
