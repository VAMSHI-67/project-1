import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const Modal = ({
  open,
  onClose,
  children
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  children: React.ReactNode;
}) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog onClose={onClose} className="relative z-50">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-forest-900/40 backdrop-blur-sm" />
      </Transition.Child>
      <div className="fixed inset-0 flex items-end justify-center px-4 md:items-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-xl rounded-t-3xl bg-white/90 p-8 shadow-glass md:rounded-3xl">
            {children}
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition.Root>
);
