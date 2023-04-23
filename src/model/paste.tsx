import { z } from "zod";

export const PasteSchema = z.object({
  paste: z.string().nonempty("Must not be empty!"),
  name: z
    .string()
    .trim()
    .transform((name) => (name === "" ? undefined : name))
    .optional(),
});
