import z from "zod";

export const idParamsSchema = z.object({
  id: z.coerce.number().positive().int(),
});
