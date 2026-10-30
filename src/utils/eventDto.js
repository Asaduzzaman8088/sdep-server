export function toEventDto(event) {
  return {
    id: event._id.toString(),
    title: event.title,
    description: event.description,
    eventType: event.eventType,
    thumbnail: event.thumbnail,
    location: event.location,
    eventDate: new Date(event.eventDate).toISOString(),
    capacity: event.capacity ?? 0,
    joinedCount: event.joinedCount ?? 0,
    createdBy: {
      id: event.createdBy?.id ?? "",
      name: event.createdBy?.name ?? "",
      email: event.createdBy?.email ?? "",
      image: event.createdBy?.image ?? "",
    },
    createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : null,
    updatedAt: event.updatedAt ? new Date(event.updatedAt).toISOString() : null,
  };
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
