import type { FormEventHandler, ChangeEventHandler } from "react";
import { useEffect, useState } from "react";
import { z } from "zod";

import LabeledInput from "./labeled-input";

// resizes text area to fit text
const autoResize: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
  e.target.style.height = "inherit";
  e.target.style.height = `${e.target.scrollHeight}px`;
};

const PasteSchema = z.object({
  paste: z.string().nonempty("Must not be empty!"),
  name: z
    .string()
    .trim()
    .transform((name) => (name === "" ? undefined : name))
    .optional(),
});

const PasteInput = () => {
  const [emptyPasteError, setEmptyPasteError] = useState("");

  useEffect(() => {
    if (emptyPasteError) {
      window.scrollTo(0, 0);
    }
  }, [emptyPasteError]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const result = PasteSchema.safeParse(formData);
    if (result.success) {
      setEmptyPasteError("");
      console.log(result.data);
      // submit
    } else {
      const errors = result.error.format();

      const newEmptyPasteError =
        errors.paste?._errors.join(", ") ?? emptyPasteError;
      setEmptyPasteError(newEmptyPasteError);
      newEmptyPasteError && window.scrollTo(0, 0);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold">New Paste</h1>

        {emptyPasteError && (
          <div className="bg-red-600 p-2">{emptyPasteError}</div>
        )}

        <textarea
          className="min-h-[300px] w-full resize-none bg-zinc-800 px-2 py-1 font-mono text-slate-100 outline-none"
          onChange={autoResize}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="paste"
        />
      </div>

      <div className="my-4 flex flex-col gap-2">
        <h2 className="font-semibold">Optional Paste Settings</h2>
        <div className="flex max-w-xs flex-col gap-4">
          <LabeledInput label="Paste name" name="name" />
          <button className="place-self-start" type="submit">
            Create new Paste
          </button>
        </div>
      </div>
    </form>
  );
};

export default PasteInput;
