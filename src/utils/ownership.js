import { ApiError } from "../middleware/error.js";

export function assertEventOwner(event, user) {
  const isOwner =
    event.createdBy?.id === user.id ||
    (!!user.email && event.createdBy?.email === user.email);

  if (!isOwner) {
    throw new ApiError(403, "You can only manage events that you created.");
  }
}
