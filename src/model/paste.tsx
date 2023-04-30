import { z } from "zod";
import SyntaxHighlighter from "react-syntax-highlighter";

export const NO_LANGUAGE = "No language";

export const languages = [
  NO_LANGUAGE,
  ...SyntaxHighlighter.supportedLanguages,
] as const;

const ExposureTypes = {
  Public: "Public",
  Unlisted: "Unlisted",
  Private: "Private",
} as const;

const { Public, Private, Unlisted } = ExposureTypes;

export type ExposureType = keyof typeof ExposureTypes;
export const exposureTypes = [Public, Unlisted, Private] as const;

export const disabledExposure: { [ExposureTypes.Private]: true } = {
  Private: true,
};

export const PasteSchema = z.object({
  paste: z.string().nonempty("You need to write some paste!"),
  name: z.string().trim().optional(),
  language: z.string({ required_error: "Hey that's cheating" }),
  exposure: z.enum(exposureTypes, { required_error: "BRUH" }),
});
