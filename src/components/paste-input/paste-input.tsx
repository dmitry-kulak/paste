import { type ChangeEventHandler } from "react";

const autoResize: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
  e.target.style.height = "inherit";
  e.target.style.height = `${e.target.scrollHeight}px`;
};

const PasteInput = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">New Paste</h1>
      <textarea
        className="min-h-[300px] w-full resize-none bg-zinc-800 px-2 py-1 font-mono text-slate-100 outline-none"
        onChange={autoResize}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
};

export default PasteInput;
