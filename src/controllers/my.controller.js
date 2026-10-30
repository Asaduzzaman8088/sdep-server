import { Event } from "../models/event.model.js";
import { Join } from "../models/join.model.js";
import { toEventDto } from "../utils/eventDto.js";

export async function getMyEvents(req, res) {
  const events = await Event.find({ "createdBy.id": req.user.id })
    .sort({ eventDate: -1, createdAt: -1 })
    .lean();

  res.json({ events: events.map(toEventDto) });
}

export async function getMyJoinedEvents(req, res) {
  const joins = await Join.find({ "user.id": req.user.id })
    .sort({ eventDate: 1, joinedAt: 1 })
    .populate("eventId")
    .lean();

  const events = joins
    .filter((join) => join.eventId)
    .map((join) => ({
      ...toEventDto(join.eventId),
      joinedAt: join.joinedAt
        ? new Date(join.joinedAt).toISOString()
        : new Date(join.createdAt).toISOString(),
    }))
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    );

  res.json({ events });
}
