import { classNames } from "../utils/clsx";

export default function Tooltip(props: { text: string; className?: string }) {
  return (
    <span
      className={classNames(
        "tooltip text-sm rounded shadow-lg p-2 bg-white text-gray-500 ",
        props.className
      )}
    >
      {props.text}
    </span>
  );
}
