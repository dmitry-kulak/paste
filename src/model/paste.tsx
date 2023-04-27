import { z } from "zod";
import SyntaxHighlighter from "react-syntax-highlighter";

export const NO_LANGUAGE = "No language";

export const languages = [
  NO_LANGUAGE,
  ...SyntaxHighlighter.supportedLanguages,
] as const;

export const exposureTypes = ["Public", "Unlisted", "Private"] as const;
export type ExposureType = (typeof exposureTypes)[number];

export const PasteSchema = z.object({
  paste: z.string().nonempty("You need to write some paste!"),
  name: z.string().trim().optional(),
  language: z.string({ required_error: "Hey that's cheating" }),
  exposure: z.enum(exposureTypes, { required_error: "BRUH" }),
});
