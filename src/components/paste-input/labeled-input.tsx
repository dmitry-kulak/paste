type LabeledInputProps = { label: string; name: string };

const LabeledInput = ({ label, name }: LabeledInputProps) => (
  <div className="grid grid-cols-3 items-center">
    <label className="col-span-1" htmlFor={name}>
      {label}
    </label>

    <input
      className="col-span-2 bg-zinc-800 px-2 py-1 text-slate-100 outline-none"
      type="text"
      name={name}
    />
  </div>
);

export default LabeledInput;
