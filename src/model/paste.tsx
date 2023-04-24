import { z } from "zod";
import SyntaxHighlighter from "react-syntax-highlighter";

export const languages = SyntaxHighlighter.supportedLanguages.slice();

export const PasteSchema = z.object({
  paste: z.string().nonempty("You need to write some paste!"),
  name: z
    .string()
    .trim()
    .transform((name) => (name === "" ? undefined : name))
    .optional(),
  language: z
    .string()
    .transform((name) => (name === "No language" ? undefined : name))
    .optional(),
});
