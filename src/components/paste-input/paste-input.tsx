import type { ChangeEventHandler, FormEventHandler } from "react";
import type { Paste } from "@prisma/client";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import {
  disabledExposure,
  exposureTypes,
  languages,
  PasteSchema,
} from "@/model/paste";
import { api } from "@/utils/api";
import LabeledInput from "./labeled-input";
import Dropdown from "./dropdown";

// resizes text area to fit text
const autoResize: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
  e.target.style.height = "inherit";
  e.target.style.height = `${e.target.scrollHeight}px`;
};

const PasteInput = () => {
  const router = useRouter();
  const invalidatePastes = api.useContext().paste.getAll.invalidate;
  const openNewPaste = (paste: Paste) => (
    invalidatePastes().catch(console.error), router.push(paste.id)
  );

  const { status } = useSession();

  const { mutate: createPaste, isLoading: isUploadingPaste } =
    api.paste.create.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: openNewPaste,
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
          <Dropdown label="Languages" name="language" options={languages} />
          <Dropdown
            label="Exposure"
            name="exposure"
            options={exposureTypes}
            disabledOptions={
              status === "unauthenticated" ? disabledExposure : undefined
            }
          />

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
