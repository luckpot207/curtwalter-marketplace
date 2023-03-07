// import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { fetchCollectionFloor } from "../api/actions";
// import { getUserFullData, updateUser } from "../api/api";
// import { store, useSelector } from "../api/store";
import { RegisterDialog } from "../components/account";
import { Image } from "../components/TradingHistory";
import { Collection, User, UserNotifications } from "../data/marketplace.pb";
import { addNotification } from "../utils/alert";
import { classNames } from "../utils/clsx";
import { lamportsToSOL } from "../utils/sol";
const LAMPORTS_PER_SOL = 10;
function getFormDataBoolean(data: FormData, key: string) {
  const value = data.get(key) as string;
  return value === "on" || value === "true";
}

function getFormDataPrice(data: FormData, key: string) {
  return Math.round(Number(data.get(key) as string) * LAMPORTS_PER_SOL) || 0;
}

export default function Profile(props: {
  publicKey: string;
  user?: User;
  collections: Collection[];
}) {
  const { user } = props;

  const [registerOpen, setRegisterModalVisiblity] = useState(false);

  const fullUser = !!user?.annotations ? user : undefined;

  // const { floorPrices, hasUser } = useSelector((state: { floorPrices: any; hasUser: any; }) => ({
  //   floorPrices: state.floorPrices,
  //   hasUser: state.hasUser,
  // }));

  // const onGetUser = () => {
  //   getUserFullData(props.publicKey)
  //     .then((res: any) => {
  //       store?.dispatch?.({ type: "SetUser", user: res });
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // };

  const onSubmitForm = (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const email = (data.get("email") as string) || undefined;
    const username = (data.get("username") as string) || undefined;
    const notifications = fullUser!.notifications || ({} as UserNotifications);

    notifications.disableItemsSold = !getFormDataBoolean(
      data,
      "disableItemsSold"
    );
    notifications.disableNewOffers = !getFormDataBoolean(
      data,
      "disableNewOffers"
    );
    notifications.disableOfferAccepted = !getFormDataBoolean(
      data,
      "disableOfferAccepted"
    );
    notifications.disableFeaturedCollections = !getFormDataBoolean(
      data,
      "disableFeaturedCollections"
    );
    notifications.disableNewCollection = !getFormDataBoolean(
      data,
      "disableNewCollection"
    );

    const minimumOffer =
      Math.round(
        Number(data.get("offer_threshold") as string) * LAMPORTS_PER_SOL
      ) || 0;

    const minimumCollectionOffers = fullUser?.minimumCollectionOffers || {};

    for (const key of (data as any).keys()) {
      if (key.startsWith("offer_price_")) {
        const price = getFormDataPrice(data, key);
        const slug = key.substring("offer_price_".length);
        minimumCollectionOffers[slug] = price;
      }
    }
    if (username?.includes("@")) {
      addNotification("You can't use @ in your username", undefined, "error");
      return;
    }

    // updateUser(props.publicKey, {
    //   email,
    //   username,
    //   notifications,
    //   minimumOffer,
    //   minimumCollectionOffers,
    // })
    //   .then((res: any) => {
    //     store?.dispatch?.({ type: "SetUser", user: res });
    //     addNotification("Profile updated succesfully");
    //   })
    //   .catch((err: { message: string | undefined; }) => {
    //     addNotification("Error", err.message, "error");
    //   });
  };

  // useEffect(() => {
  //   props.collections.forEach((c) => {
  //     if (!floorPrices[c.id!]) {
  //       fetchCollectionFloor(c.id!);
  //     }
  //   });
  // }, []);

  // if (hasUser === "unknown") {
  //   return null;
  // }

  if (!user) {
    return (
      <div className="pb-8">
        <div>
          <h2 className="mt-6 text-lg font-extrabold text-gray-900">
            Don't miss the offers!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register now to receive offers and trade email notifications.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRegisterModalVisiblity(true)}
          className="mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700 "
        >
          Register
        </button>

        <RegisterDialog
          publicKey={props.publicKey || ""}
          user={user}
          isOpen={registerOpen}
          mode={"register"}
          onClose={() => setRegisterModalVisiblity(false)}
          onRegistered={(user) => {
            // store.dispatch?.({ type: "SetUser", user });
            // store.dispatch?.({ type: "SetHasUser", hasUser: "yes" });
            // setRegisterModalVisiblity(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {!fullUser && (
        <div className="pb-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 ">
              Update Account Settings
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Verify your wallet in order to update your settings.
            </p>
          </div>
          <button
            type="button"
            // onClick={onGetUser}
            className="mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700 "
          >
            Enable Edit
          </button>
        </div>
      )}

      <form
        onSubmit={onSubmitForm}
        action="POST"
        className={classNames(
          "space-y-8 divide-y divide-gray-200",
          !fullUser ? "opacity-25 pointer-events-none" : ""
        )}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 ">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    defaultValue={user?.username}
                    className="form-input flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                We'll always let you know about important changes, but you pick
                what else you want to hear about.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
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
                    placeholder={"?????"}
                    defaultValue={fullUser?.email}
                    className="form-input appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <b className="text-xs">
                  {" "}
                  Your email address won't be shared with any third party.
                </b>
              </div>
              <div className="sm:col-span-4">
                <fieldset>
                  <div className="mt-4 space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <NotificationCheckbox
                          fullUser={fullUser}
                          field="disableItemsSold"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="candidates"
                          className="font-medium text-gray-700"
                        >
                          Item Sold
                        </label>
                        <p className="text-gray-500">
                          Get notified when you sold an NFT.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <NotificationCheckbox
                          fullUser={fullUser}
                          field="disableOfferAccepted"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="candidates"
                          className="font-medium text-gray-700"
                        >
                          Offer Accepted
                        </label>
                        <p className="text-gray-500">
                          Get notified when your offer is accepted by the NFT
                          owner.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <NotificationCheckbox
                          fullUser={fullUser}
                          field="disableNewOffers"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="comments"
                          className="font-medium text-gray-700"
                        >
                          New Offers
                        </label>
                        <p className="text-gray-500">
                          Get notified when someones make an offer for your
                          NFTs.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <NotificationCheckbox
                          fullUser={fullUser}
                          field="disableNewCollection"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="comments"
                          className="font-medium text-gray-700"
                        >
                          Collection Available
                        </label>
                        <p className="text-gray-500">
                          Get notified when a collection which you have an NFT
                          from becomes available on Alpha.art.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <NotificationCheckbox
                          fullUser={fullUser}
                          field="disableFeaturedCollections"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="comments"
                          className="font-medium text-gray-700"
                        >
                          Featured Collections
                        </label>
                        <p className="text-gray-500">
                          Get occasional updates about featured collections.
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Minimum Offer Threshold
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        Receive notifications only when you receive offers with
                        a value grater than or equal to this amount of SOL
                      </p>
                      <PriceInput
                        fullUser={fullUser}
                        field={`offer_threshold`}
                        fullWidth
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <h3 className="text-lg leading-6 font-medium text-gray-900 ">
                Minimum Offer Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Set a minimum offer for collections to ignore low offers.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="flex flex-col sm:col-span-4 mt-2">
                {props.collections?.map((c) => (
                  <div className="flex mt-2 items-center mb-4">
                    <div className="flex flex-1 items-start">
                      <Link to={`/collection/${c.slug}`}>
                        <div className="flex mt-2 items-center mb-4">
                          <div className="rounded-full overflow-hidden mr-4">
                            <Image src={c.thumbnail!} />
                          </div>
                          <div>
                            <h3 className="text-md text-left flex-1">
                              {c.title}
                            </h3>
                            {/* {floorPrices[c.id!] && (
                              <span className="text-xs">
                                Floor Price:
                                {"◎" + lamportsToSOL(floorPrices[c.id!])}
                              </span>
                            )} */}
                          </div>
                        </div>
                      </Link>
                    </div>
                    <PriceInput fullUser={fullUser} field={c.slug!} />
                  </div>
                ))}
                {props.collections.length === 0 && (
                  <p className="mt-1 text-sm">
                    When you own NFTs, collections will appear here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function NotificationCheckbox({
  fullUser,
  field,
}: {
  fullUser?: User;
  field: keyof UserNotifications;
}) {
  return (
    <input
      key={JSON.stringify(fullUser) + "-" + field}
      name={field}
      type="checkbox"
      defaultChecked={!fullUser?.notifications?.[field]}
      className="form-checkbox focus:ring-indigo-500 h-4 w-4 text-indigo-600 dark:text-indigo-600 border-gray-300 rounded"
    />
  );
}

function PriceInput({
  fullUser,
  field,
  fullWidth,
}: {
  fullUser?: User;
  field: string;
  fullWidth?: boolean;
}) {
  const defaultValue =
    field === "offer_threshold"
      ? fullUser?.minimumOffer
      : fullUser?.minimumCollectionOffers?.[field];
  const fieldValue =
    field === "offer_threshold" ? field : "offer_price_" + field;
  return (
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-base">◎</span>
      </div>
      <input
        key={JSON.stringify(fullUser) + "-" + fieldValue}
        type="number"
        name={fieldValue}
        id={fieldValue}
        className={classNames(
          "form-input h-12 focus:ring-indigo-500 focus:border-indigo-500 block  pl-8 pr-16 sm:text-xl border-gray-300 rounded-md",
          fullWidth ? "w-full" : "w-64"
        )}
        placeholder="0.00"
        min={0}
        step={0.001}
        aria-describedby="price-currency"
        defaultValue={Number(defaultValue || 0) / LAMPORTS_PER_SOL}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm" id="price-currency">
          SOL
        </span>
      </div>
    </div>
  );
}
