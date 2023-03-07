import { classNames } from "../utils/clsx";

export default function Button(props: {
  onClick?: () => void;
  title: string;
  disabled?: boolean;
  size?: "medium" | "small";
  className?: string;
}) {
  const { onClick, disabled, title, size = "small", className } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "w-full border border-transparent rounded-md items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 nightwind-prevent",
        size === "medium" ? "py-3 px-8" : "py-2 px-2",
        disabled
          ? "bg-indigo-200 hover:bg-indigo-200 "
          : "bg-indigo-600 hover:bg-indigo-700 ",
        className
      )}
    >
      {title}
    </button>
  );
}
