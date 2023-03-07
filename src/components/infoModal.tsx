import { BiCheck as CheckIcon } from "react-icons/bi";
import React, { ReactNode } from "react";
import Modal from "./dialog";

export default function InfoModal(props: {
  children: ReactNode;
  title: string;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={props.visible} onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-velvet dark:bg-velvet rounded-full flex items-center justify-center mb-5">
          <CheckIcon className="w-6 h-6 text-white dark:text-white" />
        </div>
        <p className="text-white dark:text-white text-center mb-2">
          {props.title}
        </p>

        <div className="mt-2 text-mediumgray dark:text-paperwhite text-center mb-6">
          {props.children}
        </div>

        <button
          className="bg-black text-white dark:bg-velvet dark:text-white py-2 w-full rounded-md"
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
