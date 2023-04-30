import { memo } from "react";

type DropdownProps = {
  name: string;
  label: string;
  options: readonly string[];
  disabledOptions?: Record<string, true>;
};

const Dropdown = memo(
  ({ options, name, label, disabledOptions }: DropdownProps) => (
    <div className="grid grid-cols-3 items-center">
      <label className="col-span-1" htmlFor={name}>
        {label}
      </label>

      <select
        name={name}
        className="col-span-2 bg-zinc-800 px-2 py-1 text-slate-100 outline-none"
      >
        {options.map((option) => (
          <option
            value={option}
            key={option}
            disabled={disabledOptions?.[option]}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  )
);

export default Dropdown;
