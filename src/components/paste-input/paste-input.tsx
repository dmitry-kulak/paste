import type { FormEventHandler, ChangeEventHandler } from "react";
import { memo } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { languages, PasteSchema } from "@/model/paste";
import { api } from "@/utils/api";
import LabeledInput from "./labeled-input";

const LanguagesDropdown = memo(() => (
  <div className="grid grid-cols-3 items-center">
    <label className="col-span-1" htmlFor="language">
      Language
    </label>

    <select
      name="language"
      className="col-span-2 bg-zinc-800 px-2 py-1 text-slate-100 outline-none"
    >
      {languages.map((language) => (
        <option value={language} key={language}>
          {language}
        </option>
      ))}
    </select>
  </div>
));
LanguagesDropdown.displayName = "LanguagesDropdown";

// resizes text area to fit text
const autoResize: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
  e.target.style.height = "inherit";
  e.target.style.height = `${e.target.scrollHeight}px`;
};

const PasteInput = () => {
  const router = useRouter();

  const { mutate: createPaste, isLoading: isUploadingPaste } =
    api.paste.create.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: (paste) => router.push(paste.id),
    });

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const result = PasteSchema.safeParse(formData);
    if (result.success) {
      createPaste(result.data);
    } else {
      const errors = result.error.flatten();

      Object.values(errors.fieldErrors).forEach((field) =>
        field.forEach((error) => toast.error(error))
      );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold">New Paste</h1>

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
          <LanguagesDropdown />

          <button
            className="place-self-start rounded  bg-zinc-800 px-3 py-2"
            type="submit"
          >
            {isUploadingPaste ? "Creating..." : "Create new Paste"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PasteInput;
