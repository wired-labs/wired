import { forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const TextFieldDark = forwardRef<HTMLInputElement, Props>(
  ({ label, className, children, ...rest }, ref) => {
    return (
      <label className="block space-y-1">
        {label && <div className="font-bold text-neutral-400">{label}</div>}

        <div className="relative">
          <input
            ref={ref}
            type="text"
            className={`w-full rounded-lg bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-400 ${className}`}
            {...rest}
          />

          {children}
        </div>
      </label>
    );
  }
);

TextFieldDark.displayName = "TextFieldDark";

export default TextFieldDark;
