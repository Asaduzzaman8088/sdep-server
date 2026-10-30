import { Event } from "../models/event.model.js";
import { Join } from "../models/join.model.js";

export async function getStats(_req, res) {
  const now = new Date();

  const [upcomingEvents, totalEvents, totalJoins, volunteerIds] =
    await Promise.all([
      Event.countDocuments({ eventDate: { $gt: now } }),
      Event.countDocuments({}),
      Join.countDocuments({}),
      Join.distinct("user.id"),
    ]);

  res.json({
    upcomingEvents,
    totalEvents,
    totalJoins,
    totalVolunteers: volunteerIds.length,
  });
}
