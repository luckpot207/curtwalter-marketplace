import {
  BiPlusCircle as PlusCircleIcon,
  BiCheckCircle as CheckCircleIcon,
} from "react-icons/bi";

export interface GalleryItem {
  src: string;
  id: number;
  slug: string;
  staked?: boolean;
  name: string;
}
export default function TokenGalleryItem(props: {
  item: GalleryItem;
  classSelected: boolean;
  readyForSelection: boolean;
  isModal: boolean;
}) {
  return (
    <div
      key={props.item.id}
      className={`relative w-full border h-full rounded-[4px] ${props.classSelected ? "dark:border-velvet" : "!border-transparent"
        }`}
    >
      <div
        className={`${props.readyForSelection
          ? `rounded-[4px] bg-silver dark:bg-darkgray ${props.isModal ? "border-[16px]" : "border-[6px]"
          } border-silver dark:border-darkgray border-solid`
          : ""
          } ${props.classSelected
            ? `rounded-[6px] dark:bg-black ${props.isModal ? "border-[16px]" : "border-[6px]"
            } border-silver dark:border-black border-solid`
            : ""
          } `}
      >
        <img alt={props.item.name} src={`${props.item.src}`} />
      </div>
      {props.classSelected && (
        <CheckCircleIcon
          className="absolute center-icon text-white dark:text-white"
          width={18}
          height={18}
        />
      )}
      {props.readyForSelection && (
        <PlusCircleIcon
          className="absolute center-icon text-white dark:text-white"
          width={18}
          height={18}
        />
      )}
    </div>
  );
}
