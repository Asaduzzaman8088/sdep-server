import { ApiError } from "./error.js";

export function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        "Please check the highlighted fields and try again.",
        {
          issues: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      );
    }

    req.validatedBody = result.data;
    next();
  };
}
