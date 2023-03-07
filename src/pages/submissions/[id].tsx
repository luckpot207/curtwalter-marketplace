import React, { forwardRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import { useSelector } from "../../api/store";
import {
  AcceptStatus,
  ALL_AcceptStatus_VALUES,
  ListingApp,
} from "../../data/form.pb";
import { classNames } from "../../utils/clsx";
import {
  ImageStatus,
  Websites,
  findLinkFor,
  WebURL,
} from "../../EditCollection";
import {
  getCollectionSubmission,
  sendCollectionSubmission,
  signToken,
  updateListCollectionSubmissions,
} from "../../api/api";
import { addNotification } from "../../utils/alert";
import { API_ADDRESS } from "../../api/app/constants";
import { useDropzone } from "react-dropzone";
import ReactDatePicker from "react-datepicker";
import {
  BiArrowBack as ArrowLeftIcon,
  BiCalendar as CalendarIcon,
  BiTime as ClockIcon,
} from "react-icons/bi";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { Link as RouterLink } from "react-router-dom";
import { parseISO } from "date-fns";
import { CandyMachineIds } from "../../components/listing/CandyMachineIds";
import { Spinner } from "../../components/spiners";


export default function SubmissionUpsert() {
  const params = useParams<{ id: string }>();
  // const walletModal = useWalletModal();
  const { wallet, accessToken } = useSelector((data) => ({
    wallet: data.wallet,
    accessToken: data.accessToken,
  }));

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState<ListingApp>();

  const isEdit = params.id !== "new" || listing;
  const hasActiveToken = accessToken && accessToken?.expAt > Date.now() / 1000;

  useEffect(() => {
    if (wallet?.publicKey && hasActiveToken && isEdit && params.id !== "new") {
      setLoading(true);
      getCollectionSubmission(wallet!.publicKey!.toBase58(), params.id!)
        .then((r) => {
          setListing(r);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [wallet?.publicKey, isEdit, hasActiveToken]);
  return (
    <div className="bg-white">
      <Helmet>
        <title>
          Alpha.art | {isEdit ? "Update" : "New"} Collection Submission
        </title>
      </Helmet>
      <div className="mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div className="flex flex-row items-center pb-4 border-b-2">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex-1 flex flex-row items-center">
                  <RouterLink to="/submissions">
                    <ArrowLeftIcon className="h-6 w-6 mr-4" />
                  </RouterLink>
                  {isEdit ? "Update" : "New"} Collection Submission
                </h3>
              </div>
              {!wallet && (
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="flex flex-col flex-1 items-center">
                    <p className="font-base">You need to connect your wallet</p>
                    <button
                      type="button"
                      onClick={() => {
                        // walletModal.setVisible(true);
                      }}
                      className="mt-4 bg-indigo-600 dark:bg-indigo-600 dark:text-white border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                    >
                      Connect Wallet
                    </button>
                  </div>
                </div>
              )}
              {wallet &&
                (!accessToken || accessToken?.expAt < Date.now() / 1000) && (
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div className="flex flex-col flex-1 items-center">
                      <p className="font-base">
                        You need to sign the request to see this page.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          signToken(wallet!.publicKey!.toBase58());
                        }}
                        className="mt-4 bg-indigo-600 dark:bg-indigo-600 dark:text-white border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                      >
                        Sign Request
                      </button>
                    </div>
                  </div>
                )}
              {loading && (
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="flex flex-col flex-1 items-center">
                    <p className="font-base">Loading</p>
                  </div>
                </div>
              )}
              {wallet && accessToken && !loading && (
                <AddCollectionSubmissionInner
                  key={JSON.stringify(listing)}
                  listing={listing}
                  setListing={setListing}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddCollectionSubmissionInner(props: {
  listing?: ListingApp;
  setListing: (listing: ListingApp) => void;
}) {
  const listing = props.listing;
  const { wallet, user } = useSelector((data) => ({
    wallet: data.wallet,
    user: data.user,
  }));

  const [candyIds, setCandyIds] = useState(listing?.candyIds || []);

  const [mintDate, setMintDate] = useState(
    listing?.mintTime ? new Date(listing.mintTime) : new Date()
  );

  const [featureFrom, setFeatureFrom] = useState(
    listing?.featureFrom ? new Date(listing.featureFrom) : new Date()
  );
  const [featureUntil, setFeatureUntil] = useState(
    listing?.featureUntil ? new Date(listing.featureUntil) : new Date()
  );

  const [links, setLinks] = React.useState(listing?.otherLinks ?? []);
  /*   const [collaborators, setCollaborators] = React.useState(
    meta.collection?.collaborators ?? []
  ); */
  const [thumbnail, setThumbnail] = React.useState<ImageStatus>(
    listing?.pfp
      ? {
        type: "original",
        uri: listing?.pfp!,
      }
      : { type: "reset" }
  );
  const [banner, setBanner] = React.useState<ImageStatus>(
    listing?.banner
      ? {
        type: "original",
        uri: listing?.banner!,
      }
      : { type: "reset" }
  );
  const [featuredImage, setFeaturedImage] = React.useState<ImageStatus>(
    listing?.featuredImage
      ? {
        type: "original",
        uri: listing?.featuredImage!,
      }
      : { type: "reset" }
  );

  const createListing = (listingApp: ListingApp) => {
    sendCollectionSubmission(wallet!.publicKey!.toBase58(), listingApp).then(
      (id) => {
        getCollectionSubmission(wallet!.publicKey!.toBase58(), id!).then(
          (r) => {
            window.history.replaceState(
              null,
              "Alpha.art | Update Collection Submission",
              "/submissions/" + id
            );
            props.setListing(r);
            addNotification("Collection Submitted");
          }
        );
      }
    );
  };
  const camelToSnakeCase = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const updateListing = (newListingApp: ListingApp) => {
    const fields: string[] = [];
    const oldListingApp = listing;
    Object.keys(newListingApp).forEach((key) => {
      if (
        key === "mintTime" ||
        key === "featureFrom" ||
        key === "featureUntil"
      ) {
        if (
          differenceInMinutes(
            parseISO((oldListingApp as any)[key]),
            parseISO((newListingApp as any)[key])
          ) !== 0
        ) {
          fields.push(camelToSnakeCase(key));
        }
      } else if (
        JSON.stringify((oldListingApp as any)[key] || "") !==
        JSON.stringify((newListingApp as any)[key] || "")
      ) {
        fields.push(camelToSnakeCase(key));
      }
    });
    if (fields.length === 0) {
      addNotification("Nothing to update", undefined, "error");
      return;
    }
    updateListCollectionSubmissions(
      wallet!.publicKey!.toBase58(),
      fields,
      newListingApp
    ).then(() => {
      getCollectionSubmission(
        wallet!.publicKey!.toBase58(),
        newListingApp.id!
      ).then((r) => {
        props.setListing(r);
        addNotification("Collection Submission Updated");
      });
    });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);
    for (var pair of (data as any).entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    const listingApp: ListingApp = {};
    if (listing) {
      listingApp.id = listing.id;
    }
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const twitter = data.get("twitter") as string;
    const discordInvite = data.get("discord") as string;
    const howrare = data.get("howrare") as string;
    const website = data.get("website") as string;
    const instagram = data.get("instagram") as string;

    const totalItems = data.get("totalItems") as string;

    const email = data.get("email") as string;
    const discordId = data.get("discordId") as string;
    const other = data.get("other") as string;

    const minted = (data.get("minted") as string) === "yes";
    const accepted = data.get("accepted") as string;
    const acceptStatus = data.get("acceptStatus") as AcceptStatus;
    const featured = data.get("featured") as string;
    const reached = data.get("reached") as string;
    const ownerPubkey = data.get("ownerPubkey") as string;

    listingApp.name = name;
    listingApp.description = description;

    if (twitter) {
      listingApp.twitter = WebURL["twitter"] + twitter;
    }
    if (discordInvite) {
      listingApp.discordInvite = WebURL["discord"] + discordInvite;
    }

    if (howrare || instagram || website) {
      listingApp.otherLinks = [];
      if (howrare) {
        listingApp.otherLinks?.push(WebURL["howrare"] + howrare);
      }
      if (instagram) {
        listingApp.otherLinks?.push(WebURL["instagram"] + instagram);
      }
      if (website) {
        listingApp.otherLinks?.push(website);
      }
    }

    if (thumbnail.type === "new") {
      listingApp.pfp = thumbnail.uri;
    }
    if (banner.type === "new") {
      listingApp.banner = banner.uri;
    }
    if (featuredImage.type === "new") {
      listingApp.featuredImage = featuredImage.uri;
    }
    if (
      thumbnail.type === "wait-for-upload" ||
      banner.type === "wait-for-upload" ||
      featuredImage.type === "wait-for-upload"
    ) {
      addNotification(
        "Seems like you forget to upload images",
        undefined,
        "error"
      );
      return;
    }

    listingApp.ownerPubkey = ownerPubkey || wallet!.publicKey!.toBase58();
    listingApp.candyIds = candyIds;
    listingApp.email = email;
    listingApp.minted = minted;
    listingApp.mintTime = mintDate.toISOString();
    listingApp.totalItems = parseInt(totalItems);
    listingApp.discordId = discordId;
    listingApp.other = other;
    if (user?.isAdmin) {
      if (accepted !== null) {
        listingApp.accepted = accepted === "yes";
      }
      if (acceptStatus) {
        listingApp.acceptStatus = acceptStatus;
      }
      if (featured !== null) {
        listingApp.featured = featured === "yes";
      }
      if (reached !== null) {
        listingApp.reached = reached === "yes";
      }

      if (listingApp.featured) {
        listingApp.featureFrom = featureFrom.toISOString();
        listingApp.featureUntil = featureUntil.toISOString();
      }
    }

    const isEdit = !!listing;
    if (isEdit) {
      updateListing(listingApp);
    } else {
      createListing(listingApp);
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={onSubmit}>
        <div className="mx-auto lg:max-w-7xl">
          <div className="space-y-16 divide-y divide-gray-200">
            <div className="space-y-16 divide-y divide-gray-200">
              <div className="mt-6 sm:mt-5 space-y-12 sm:space-y-5">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Collection Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This information will be displayed publicly.
                  </p>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="links"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Name
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      key={"name-" + listing?.name}
                      id="name"
                      name="name"
                      type="name"
                      required
                      defaultValue={listing?.name}
                      className="form-input appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Description
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={3}
                      className="form-textarea max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 bg-white rounded-md"
                      defaultValue={listing?.description}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Write a few sentences about the collection.
                    </p>
                  </div>
                </div>
                <SingleLink
                  title="Twitter"
                  website="twitter"
                  link={listing?.twitter}
                  updateLink={() => { }}
                />
                <SingleLink
                  title="Discord"
                  website="discord"
                  link={listing?.discordInvite}
                  updateLink={() => { }}
                />

                <Links
                  title="Other Links"
                  isAdmin={user?.isAdmin}
                  links={listing?.otherLinks ?? []}
                  onChangeLinks={setLinks}
                />
                <ImageEdit
                  field="thumbnail"
                  state={thumbnail}
                  onChange={setThumbnail}
                  original={listing?.pfp!}
                />
                <ImageEdit
                  field="banner"
                  state={banner}
                  onChange={setBanner}
                  original={listing?.banner!}
                />
                <ImageEdit
                  field="featuredImage"
                  state={featuredImage}
                  onChange={setFeaturedImage}
                  original={listing?.featuredImage!}
                />
              </div>
              <div className="mt-6 sm:mt-5 space-y-12 sm:space-y-5">
                <div className="mt-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Minting
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Details about minting
                  </p>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="links"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Total Number of Items
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      key={"totalItems-" + listing?.totalItems}
                      id="totalItems"
                      name="totalItems"
                      type="number"
                      defaultValue={listing?.totalItems}
                      className="form-input appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <BooleanField
                  title="Is collection minted?"
                  name="minted"
                  required
                  defaultValue={listing?.minted}
                />
                <CandyMachineIds candyIds={candyIds} onChange={setCandyIds} />
                <DateField
                  title="Mint Date"
                  date={mintDate}
                  setDate={setMintDate}
                />
              </div>

              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="mt-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Contact
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    <b> This information won't be shared publicly.</b>
                  </p>
                </div>
                <div className="mt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    aria-required="true"
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Email
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      key={"email-" + listing?.email}
                      id="email"
                      name="email"
                      type="email"
                      required={true}
                      autoComplete="email"
                      defaultValue={listing?.email}
                      className="form-input appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="links"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Discord Id
                    <p className="text-xs text-gray-500">Optional</p>
                  </label>

                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      key={"discordId-" + listing?.discordId}
                      id="discordId"
                      name="discordId"
                      type="text"
                      defaultValue={listing?.discordId}
                      className="form-input appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Notes
                    <p className="text-xs text-gray-500">Optional</p>
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea
                      key={"other-" + listing?.other}
                      id="other"
                      name="other"
                      rows={3}
                      className="form-textarea max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 bg-white rounded-md"
                      defaultValue={listing?.other}
                    />
                  </div>
                </div>
              </div>
            </div>

            {user?.isAdmin && (
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="mt-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Manage Collection
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    <b>Admin Fields</b>
                  </p>
                </div>
                <EnumField
                  title="Accept Status"
                  name="acceptStatus"
                  required
                  values={ALL_AcceptStatus_VALUES}
                  defaultValue={listing?.acceptStatus ?? "WAITING"}
                />
                <BooleanField
                  title="Featured"
                  name="featured"
                  required={false}
                  defaultValue={listing?.featured}
                />
                <DateField
                  title="Feature From"
                  date={featureFrom}
                  setDate={setFeatureFrom}
                />
                <DateField
                  title="Feature Until"
                  date={featureUntil}
                  minDate={new Date()}
                  setDate={setFeatureUntil}
                />
                <BooleanField
                  title="Reached"
                  name="reached"
                  required={false}
                  defaultValue={listing?.reached}
                />
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="ownerPubkey"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Owner
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      key={"other-" + listing?.ownerPubkey}
                      id="ownerPubkey"
                      name="ownerPubkey"
                      className="form-textarea max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 bg-white rounded-md"
                      defaultValue={listing?.ownerPubkey}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-5">
              <div className="flex justify-end items-center">
                <p className="text-sm text-gray-700 text-center">
                  You can update submission later
                </p>
                <button
                  type="submit"
                  className={
                    "ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 nightwind-prevent"
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
function BooleanField({
  title,
  name,
  defaultValue,
  required,
}: {
  title: string;
  name: string;
  required: boolean;
  defaultValue?: boolean;
}) {
  return (
    <div className="mt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        aria-required="true"
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {title}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-row">
        <div className="flex items-center">
          <input
            id="yes"
            name={name}
            type="radio"
            value="yes"
            defaultChecked={defaultValue}
            required={required}
            className="form-radio focus:ring-indigo-500 h-4 w-4 text-indigo-600 dark:text-indigo-600 border-gray-300"
          />
          <label
            htmlFor="yes"
            className="ml-3 block text-sm font-medium text-gray-700"
          >
            Yes
          </label>
        </div>
        <div className="flex items-center ml-10">
          <input
            id="no"
            name={name}
            type="radio"
            value="no"
            defaultChecked={defaultValue === false}
            required={required}
            className="form-radio focus:ring-indigo-500 h-4 w-4 text-indigo-600 dark:text-indigo-600 border-gray-300"
          />
          <label
            htmlFor="no"
            className="ml-3 block text-sm font-medium text-gray-700"
          >
            No
          </label>
        </div>
      </div>
    </div>
  );
}

function EnumField<T>({
  title,
  name,
  defaultValue,
  required,
  values,
}: {
  title: string;
  name: string;
  required: boolean;
  defaultValue?: T;
  values: T[];
}) {
  return (
    <div className="mt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        aria-required="true"
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {title}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-row">
        {values.map((v) => (
          <div className="flex items-center mr-10">
            <input
              id="v"
              name={name}
              type="radio"
              value={v as unknown as string}
              defaultChecked={v === defaultValue}
              required={required}
              className="form-radio focus:ring-indigo-500 h-4 w-4 text-indigo-600 dark:text-indigo-600 border-gray-300"
            />
            <label
              htmlFor="v"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              {/* {v} */}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function DateField({
  title,
  date,
  minDate,
  setDate,
}: {
  title: string;
  date: Date;
  minDate?: Date;
  setDate: (date: Date) => void;
}) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor="about"
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {title}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-row">
        <div className="ml-1 flex-1">
          <ReactDatePicker
            className={"h-9 mt-1"}
            selected={date}
            onChange={(date: Date) => setDate(date)}
            endDate={date}
            minDate={minDate}
            dateFormat={"d MMMM yyyy"}
            nextMonthButtonLabel=">"
            previousMonthButtonLabel="<"
            timeIntervals={30}
            customInput={<CustomDateInput />}
          />
        </div>
        <div className="ml-1 flex-1">
          <ReactDatePicker
            className={"h-9 mt-1"}
            selected={date}
            onChange={(date: Date) => setDate(date)}
            dateFormat="h:mm aa"
            timeIntervals={30}
            dropdownMode="scroll"
            popperClassName="pl-0 pr-0"
            customInput={<CustomTimeInput />}
            showTimeSelectOnly
            showTimeSelect
          />
        </div>
      </div>
    </div>
  );
}

export function Links(props: {
  title?: string;
  isAdmin?: boolean;
  links: string[];
  onChangeLinks?: (links: string[]) => void;
}) {
  const [links, setLinks] = React.useState<Record<Websites, string>>({
    discord: "",
    website: "",
    twitter: "",
    instagram: "",
    howrare: "",
    alphaart: "",
  });
  const [uplinks, setUpLinks] = React.useState<Record<Websites, string>>({
    discord: "",
    website: "",
    twitter: "",
    instagram: "",
    alphaart: "",
    howrare: "",
  });

  React.useEffect(() => {
    const initial: Record<Websites, string> = {
      discord: findLinkFor("discord", props.links) ?? "",
      website: findLinkFor("website", props.links) ?? "",
      twitter: findLinkFor("twitter", props.links) ?? "",
      instagram: findLinkFor("instagram", props.links) ?? "",
      howrare: findLinkFor("howrare", props.links) ?? "",
      alphaart: findLinkFor("alphaart", props.links) ?? "",
    };
    setLinks(initial);
    setUpLinks(initial);
  }, []);

  const updateLink = (forweb: Websites, link: string) => {
    const next = { ...uplinks, [forweb]: link };
    const out: string[] = [];
    for (const k in next) {
      const v = next[k as Websites];
      if (v.length === 0) {
        continue;
      }
      if (v.replace(WebURL[k as Websites], "").length === 0) {
        continue;
      }
      out.push(v);
    }
    setUpLinks(next);
    props.onChangeLinks?.(out.sort());
  };

  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor="links"
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {props.title || "Links"}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <Link website="website" link={links.website} onChange={updateLink} />
        <Link
          website="instagram"
          className={"mt-2"}
          link={links.instagram}
          onChange={updateLink}
        />
        {props.isAdmin && (
          <Link
            website="alphaart"
            className={"mt-2"}
            link={links.alphaart}
            onChange={updateLink}
          />
        )}
      </div>
    </div>
  );
}

export function SingleLink(props: {
  title?: string;
  link: string | undefined;
  website: Websites;
  updateLink?: (link: string) => void;
}) {
  const { link, updateLink, website } = props;
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor="links"
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {props.title || "Links"}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <Link website={website} link={link || ""} onChange={updateLink} />
      </div>
    </div>
  );
}

export function Link(props: {
  website: Websites;
  link: string;
  className?: string;
  onChange?: (forweb: Websites, link: string) => void;
}) {
  return (
    <div
      className={classNames(
        "max-w-lg flex rounded-md shadow-sm",
        props.className
      )}
    >
      {props.website !== "website" && (
        <span className="inline-flex w-44 items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
          {WebURL[props.website]}
        </span>
      )}
      <input
        type="text"
        name={props.website}
        id={props.website}
        defaultValue={props.link.replace(WebURL[props.website], "")}
        onChange={(e) =>
          props.onChange?.(
            props.website,
            WebURL[props.website] + e.currentTarget.value
          )
        }
        className={classNames(
          "form-input flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 sm:text-sm border-gray-300",
          props.website === "website"
            ? "rounded-md"
            : "rounded-none rounded-r-md "
        )}
      />
    </div>
  );
}

const CustomDateInput = forwardRef<any>((props: any, ref) => (
  <div>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
        <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        {...props}
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md dark:text-white dark:bg-black border"
        style={{ height: 38 }}
      />
    </div>
  </div>
));

const CustomTimeInput = forwardRef<any>((props: any, ref) => (
  <div>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
        <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        {...props}
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md dark:text-white dark:bg-black border"
        style={{ height: 38 }}
      />
    </div>
  </div>
));

export function ImageEdit(props: {
  state: ImageStatus;
  original: string;
  field: "banner" | "thumbnail" | "featuredImage";
  onChange: (next: ImageStatus) => void;
}) {
  const { accessToken } = useSelector((data) => ({
    accessToken: data.accessToken,
  }));
  const [uploading, setUploading] = React.useState(false);
  const { getRootProps, open, getInputProps } = useDropzone({
    // accept: ["image/png", "image/gif", "image/jpeg"],
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      props.onChange({
        type: "wait-for-upload",
        file: acceptedFiles[0],
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
    },
  });

  const upload = () => {
    if (
      props.state.type !== "wait-for-upload" ||
      typeof accessToken?.token === "undefined"
    ) {
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", props.state.file);
    console.warn(props.state.file.type);
    const tt = props.state.file.type.split("/")[1];
    fetch(`${API_ADDRESS}/api/v1/file/image?field=${props.field}&type=${tt}`, {
      method: "POST",
      headers: {
        authorization: accessToken.token,
      },
      body: form,
    })
      .then((response) => response.json())
      .then((res: { url: string }) => {
        console.log(res);
        if (res.url) {
          props.onChange({ type: "new", uri: res.url });
        } else {
          addNotification("unable to upload image", undefined, "error");
        }
        setUploading(false);
      })
      .catch((err) => {
        console.error(err);
        setUploading(false);
        addNotification("unable to upload image", undefined, "error");
      });
  };

  const ss =
    props.field === "thumbnail"
      ? "h-24 w-24 rounded-full"
      : "max-w-lg rounded-md h-32";

  const ss2 =
    props.field === "thumbnail"
      ? "h-24 w-24 rounded-full"
      : "w-96 rounded-md h-32";

  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
      <div>
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-gray-700"
        >
          {props.field === "banner"
            ? "Banner"
            : props.field === "featuredImage"
              ? "Featured Image"
              : "Thumbnail"}
        </label>
        <p className="block text-xs text-gray-600">
          {props.field === "banner"
            ? "1600x900 suggested"
            : props.field === "featuredImage"
              ? "960x640 suggested"
              : "800x800 suggested"}
        </p>
      </div>
      {props.state.type === "original" && (
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <div className="flex items-center">
            <span
              className={`${ss} overflow-hidden bg-gray-100 border-2 border-gray-300`}
            >
              <img
                src={props.state.uri}
                className="h-full w-full text-gray-300"
                alt=""
              />
              <input {...getInputProps()} />
            </span>
            <button
              type="button"
              onClick={() => {
                console.log("change!");
                open();
              }}
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change
            </button>
          </div>
        </div>
      )}
      {props.state.type === "new" && (
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <div className="flex items-center">
            <span
              className={`${ss} overflow-hidden bg-gray-100 border-2 border-gray-300 border`}
            >
              <img
                src={props.state.uri}
                className="h-full w-full text-gray-300"
                alt=""
              />
            </span>
            <button
              type="button"
              onClick={() =>
                props.onChange({ type: "original", uri: props.original })
              }
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {(props.state.type === "reset" ||
        props.state.type === "wait-for-upload") && (
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="flex items-center">
              <div
                {...getRootProps({
                  className: `${ss2} overflow-hidden bg-gray-100 border-2 border-gray-300 border-dashed`,
                })}
                style={
                  props.state.type === "wait-for-upload"
                    ? {
                      backgroundImage: `url(${props.state.preview})`,
                      backgroundSize: "cover",
                    }
                    : {}
                }
              >
                <input {...getInputProps()} />
              </div>
              {props.state.type === "reset" ? (
                <button
                  type="button"
                  onClick={open}
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Select Image
                </button>
              ) : (
                <button
                  type="button"
                  onClick={upload}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 nightwind-prevent"
                >
                  Upload Image
                </button>
              )}
              {uploading && <Spinner className="ml-2" size={32} color="white" />}
            </div>
          </div>
        )}
    </div>
  );
}