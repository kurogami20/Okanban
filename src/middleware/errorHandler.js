import { ZodError } from "zod";

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    res.status(404).json({
      message: "validation error",
      detail: err,
    });
  }

  console.error(err);
  res.status(500).send("Something did not go right ");
}
