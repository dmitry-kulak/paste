import { z } from "zod";
import SyntaxHighlighter from "react-syntax-highlighter";

export const NO_LANGUAGE = "No language";

export const languages: ReadonlyArray<string> = [
  NO_LANGUAGE,
  ...SyntaxHighlighter.supportedLanguages,
];

export const PasteSchema = z.object({
  paste: z.string().nonempty("You need to write some paste!"),
  name: z.string().trim().optional(),
  language: z.string().optional(),
});
