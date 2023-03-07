import React, { useEffect, useState } from "react";
import { TWallet } from "../api/wallet";
import { getUserFullData, registerUser, updateUser } from "../api/api";
import { User } from "../data/marketplace.pb";
import Modal from "./dialog";
import { SmallSpin } from "./spiners";
import { BiXCircle as XCircleIcon, BiInfoCircle as InformationCircleIcon } from "react-icons/bi";
import { addNotification } from "../utils/alert";

export const walletOptions: { name: string; image: any; wallet: TWallet }[] = [
  { name: "Phantom", image: "/icons/phantom.png", wallet: "Phantom" },
  { name: "Sollet", image: "/icons/sollet.svg", wallet: "Sollet" },
  { name: "Solflare", image: "/icons/solflare.svg", wallet: "Solflare" },
];

export function DontMissTheOffersDialog(props: {
  isOpen?: boolean;
  onApprove: () => void;
  onClose?: () => void;
}) {
  const onClose = () => {
    props.onClose?.();
  };

  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <div>
            <img
              className="mx-auto h-48 w-auto"
              src="/img/piggybank.png"
              alt="Piggybank"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Don't miss the offers
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Register now to receive offers and trade email notifications.
            </p>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
              onClick={props.onApprove}
            >
              Register
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={onClose}
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function RegisterDialog(props: {
  isOpen?: boolean;
  mode: "register" | "update";
  publicKey: string;
  user?: User;
  onRegistered: (user: User) => void;
  onClose?: () => void;
}) {
  const { mode, user } = props;
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errMessage, setErrMessage] = useState("");
  const [fullUser, setFullUser] = useState<User>();

  const onClose = () => {
    props.onClose?.();
    setFullUser(undefined);
  };

  useEffect(() => {
    setState("idle");
  }, [props.isOpen]);

  const onGetUser = () => {
    getUserFullData(props.publicKey)
      .then((res) => {
        setFullUser(res);
      })
      .catch((err) => {
        console.error(err);
        setState("error");
      });
  };

  const onSubmitForm = (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const email = (data.get("email") as string) || undefined;
    const username = (data.get("username") as string) || undefined;
    if (username?.includes("@")) {
      setState("error");
      setErrMessage("you can't use @ in your username");
      return;
    }
    setErrMessage("");
    if (mode === "register") {
      console.log(email, username);
      setState("loading");
      registerUser(props.publicKey, { email, username })
        .then((res) => {
          props.onRegistered(res);
          setState("idle");
          addNotification("Registration succesfull");
        })
        .catch((err) => {
          console.error(err);
          setErrMessage(err.message ?? "");
          setState("error");
        });
    } else if (mode === "update") {
      setState("loading");
      updateUser(props.publicKey, { email, username })
        .then((res) => {
          props.onRegistered(res);
          setState("idle");
          setFullUser(undefined);
          addNotification("Profile updated succesfully");
        })
        .catch((err) => {
          setState("error");
          setErrMessage(err.message ?? "");
        });
    }
  };

  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <div>
            <img
              className="mx-auto h-48 w-auto"
              src="/img/piggybank.png"
              alt="Workflow"
            />
            <form
              className="space-y-6"
              action="#"
              method="POST"
              onSubmit={onSubmitForm}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 flex flex-row">
                  <input
                    key={"email-" + fullUser?.email}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required={mode === "register"}
                    placeholder={
                      mode === "update" ? "hidden for security" : undefined
                    }
                    defaultValue={fullUser?.email}
                    className="form-input appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {mode === "update" && !fullUser && (
                    <button
                      type="button"
                      onClick={onGetUser}
                      className="w-16 ml-3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Get
                    </button>
                  )}
                </div>
              </div>
              <span className="text-xs">
                Your email address will be used for sending trade offers and
                email notifications.
                <br />
                <b> Your email address won't be shared with any third party.</b>
              </span>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    required
                    defaultValue={mode === "update" ? user?.username : ""}
                    className="form-input appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {state === "error" && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Failed to {mode}. Please try again.
                        <br />
                        {errMessage}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                {mode === "register" && (
                  <p className="text-sm text-gray-800">
                    By Clicking "Register" you accept the{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    of alpha.art
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {state === "loading" && <SmallSpin />}
                  {mode === "register" ? "Register" : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
          <div className="flex mt-2 items-center">
            <InformationCircleIcon className="w-5 h-5 text-gray-600 mr-1" />
            <p className="text-sm text-gray-500">
              Solana Ledger doesn't support message signing
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
