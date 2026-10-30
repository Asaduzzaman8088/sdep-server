import { EVENT_TYPES } from "../constants/eventTypes.js";
import { ApiError } from "../middleware/error.js";
import { Event } from "../models/event.model.js";
import { Join } from "../models/join.model.js";
import { escapeRegExp, toEventDto } from "../utils/eventDto.js";
import { assertEventOwner } from "../utils/ownership.js";
import { readObjectId, readPositiveInt } from "../utils/params.js";

function upcomingFilter() {
  return { eventDate: { $gt: new Date() } };
}

export async function getUpcomingEvents(req, res) {
  const limit = readPositiveInt(req.query.limit, 6, 24);

  const events = await Event.find(upcomingFilter())
    .sort({ eventDate: 1, createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({ events: events.map(toEventDto) });
}

export async function listEvents(req, res) {
  const page = readPositiveInt(req.query.page, 1, 10_000);
  const limit = readPositiveInt(req.query.limit, 12, 50);
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const location =
    typeof req.query.location === "string" ? req.query.location.trim() : "";
  const eventType =
    typeof req.query.type === "string" ? req.query.type.trim() : "";

  const filter = upcomingFilter();

  if (eventType) {
    if (!EVENT_TYPES.includes(eventType)) {
      throw new ApiError(400, "The selected event type is not valid.");
    }
    filter.eventType = eventType;
  }

  if (search) {
    const pattern = new RegExp(escapeRegExp(search), "i");
    filter.$or = [
      { title: pattern },
      { location: pattern },
      { description: pattern },
    ];
  }

  if (location) {
    filter.location = new RegExp(escapeRegExp(location), "i");
  }

  const [events, total] = await Promise.all([
    Event.find(filter)
      .sort({ eventDate: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Event.countDocuments(filter),
  ]);

  res.json({
    events: events.map(toEventDto),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}

export async function getEventById(req, res) {
  const eventId = readObjectId(req.params.id, "event id");
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "That event could not be found.");
  }

  let isJoined = false;

  if (req.user) {
    isJoined = Boolean(
      await Join.exists({ eventId: event._id, "user.id": req.user.id }),
    );
  }

  res.json({
    event: {
      ...toEventDto(event),
      isJoined,
    },
  });
}

export async function createEvent(req, res) {
  const user = req.user;

  if (!user.email) {
    throw new ApiError(401, "Your account is missing an email address.");
  }

  const event = await Event.create({
    ...req.validatedBody,
    capacity: req.validatedBody.capacity ?? 0,
    joinedCount: 0,
    createdBy: {
      id: user.id,
      name: user.name || user.email,
      email: user.email.toLowerCase(),
      image: user.image || "",
    },
  });

  res.status(201).json({
    message: "Event created successfully.",
    event: toEventDto(event),
  });
}

export async function updateEvent(req, res) {
  const eventId = readObjectId(req.params.id, "event id");
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "That event could not be found.");
  }

  assertEventOwner(event, req.user);

  const updates = { ...req.validatedBody };
  let dateChanged = false;

  if (updates.eventDate) {
    const nextDate = new Date(updates.eventDate);
    const currentTime = event.eventDate.getTime();

    if (nextDate.getTime() !== currentTime) {
      if (nextDate.getTime() <= Date.now()) {
        throw new ApiError(400, "Event date must be in the future.");
      }
      dateChanged = true;
    }

    updates.eventDate = nextDate;
  }

  if (
    updates.capacity !== undefined &&
    updates.capacity > 0 &&
    updates.capacity < event.joinedCount
  ) {
    throw new ApiError(
      400,
      "Capacity cannot be lower than the number of volunteers already joined.",
    );
  }

  Object.assign(event, updates);
  await event.save();

  if (dateChanged) {
    await Join.updateMany(
      { eventId: event._id },
      { $set: { eventDate: event.eventDate } },
    );
  }

  res.json({
    message: "Event updated successfully.",
    event: toEventDto(event),
  });
}

export async function deleteEvent(req, res) {
  const eventId = readObjectId(req.params.id, "event id");
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "That event could not be found.");
  }

  assertEventOwner(event, req.user);

  await Join.deleteMany({ eventId: event._id });
  await Event.deleteOne({ _id: event._id });

  res.json({ message: "Event deleted successfully." });
}

export async function joinEvent(req, res) {
  const eventId = readObjectId(req.params.id, "event id");
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "That event could not be found.");
  }

  if (event.eventDate.getTime() <= Date.now()) {
    throw new ApiError(400, "This event has already taken place.");
  }

  const alreadyJoined = await Join.exists({
    eventId: event._id,
    "user.id": req.user.id,
  });

  if (alreadyJoined) {
    throw new ApiError(409, "You have already joined this event.");
  }

  if (event.capacity > 0 && event.joinedCount >= event.capacity) {
    throw new ApiError(409, "This event is full.");
  }

  let join;

  try {
    join = await Join.create({
      eventId: event._id,
      eventDate: event.eventDate,
      user: {
        id: req.user.id,
        name: req.user.name || req.user.email,
        email: req.user.email.toLowerCase(),
        image: req.user.image || "",
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "You have already joined this event.");
    }
    throw error;
  }

  const capacityFilter =
    event.capacity > 0
      ? {
          _id: event._id,
          $expr: { $lt: ["$joinedCount", "$capacity"] },
        }
      : { _id: event._id };

  const updatedEvent = await Event.findOneAndUpdate(
    capacityFilter,
    { $inc: { joinedCount: 1 } },
    { new: true },
  );

  if (!updatedEvent) {
    await Join.deleteOne({ _id: join._id });
    throw new ApiError(409, "This event just became full. Please try another.");
  }

  res.status(201).json({
    message: "You have joined this event. See you there.",
    joinedCount: updatedEvent.joinedCount,
    isJoined: true,
  });
}

export async function leaveEvent(req, res) {
  const eventId = readObjectId(req.params.id, "event id");

  const removed = await Join.findOneAndDelete({
    eventId,
    "user.id": req.user.id,
  });

  if (!removed) {
    throw new ApiError(404, "You have not joined this event.");
  }

  const updatedEvent = await Event.findOneAndUpdate(
    { _id: eventId, joinedCount: { $gt: 0 } },
    { $inc: { joinedCount: -1 } },
    { new: true },
  );

  res.json({
    message: "You have left this event.",
    joinedCount: updatedEvent?.joinedCount ?? 0,
    isJoined: false,
  });
}
