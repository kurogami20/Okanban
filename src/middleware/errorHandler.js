import { ZodError } from "zod";
import HttpError from "../utils/errors.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    res.status(404).json({
      message: "validation error",
      detail: err,
    });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      detail: err,
    });
    return;
  }
  console.error(err);
  res.status(500).send("Something did not go right ");
}
