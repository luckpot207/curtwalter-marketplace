import React, { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { classNames } from "../utils/clsx";
import { BiX as XIcon } from "react-icons/bi";

interface ModalProps {
  children?: ReactNode;
  visible?: boolean;
  size?: "normal" | "large";
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const { size = "normal" } = props;
  return (
    <Transition.Root show={props.visible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={(v) => props.onClose?.()}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={classNames(
                "inline-block align-bottom bg-white dark:bg-zinc-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6",
                size === "normal"
                  ? "sm:max-w-lg sm:w-full"
                  : "sm:max-w-3xl sm:w-full"
              )}
            >
              <div className="w-full flex justify-end mb-5">
                <XIcon
                  className="text-black dark:text-white w-5 h-5 cursor-pointer"
                  onClick={() => props.onClose?.()}
                ></XIcon>
              </div>
              {props.children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
