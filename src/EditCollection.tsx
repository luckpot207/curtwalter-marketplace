import React from "react";
import { useDispatch, useSelector } from "./api/store";
import { useParams } from "react-router-dom";
import useCollection from "./utils/useCollection";
import { classNames } from "./utils/clsx";
import { Collection, CollectionMeta } from "./data/marketplace.pb";
import { Spinner } from "./components/spiners";
import { ConnectWalletDialog } from "./components/token/modals";
import { signToken, updateCollection } from "./api/api";
import { addNotification } from "./utils/alert";
import Modal from "./components/dialog";
import isEqual from "lodash/isEqual";
import { BiUserMinus as UserRemoveIcon } from "react-icons/bi";
import AccountName from "./components/accountName";
import { useDropzone } from "react-dropzone";
import { API_ADDRESS } from "./api/app/constants";

export function InputText(props: {
  name: string;
  label: string;
  value: string;
  onChange?: (text: string) => void;
}) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor={"input-" + props.name}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {props.label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <input
          type="text"
          id={"input-" + props.name}
          defaultValue={props.value}
          onChange={(e) => props.onChange?.(e.currentTarget.value)}
          className="form-input max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}

export const WebURL: Record<Websites, string> = {
  twitter: "https://twitter.com/",
  instagram: "https://instagram.com/",
  discord: "https://discord.gg/",
  howrare: "https://howrare.is/",
  website: "",
  alphaart: "https://alpha.art/collection/",
};

export function findLinkFor(website: Websites, links: string[]) {
  if (website === "website") {
    return links.find(
      (l) =>
        !l.startsWith(WebURL.twitter) &&
        !l.startsWith(WebURL.instagram) &&
        !l.startsWith(WebURL.discord) &&
        !l.startsWith(WebURL.howrare) &&
        !l.startsWith(WebURL.alphaart)
    );
  } else {
    const prefix = WebURL[website];
    return links.find((l) => l.startsWith(prefix));
  }
}

export type Websites =
  | "twitter"
  | "instagram"
  | "discord"
  | "howrare"
  | "alphaart"
  | "website";

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
        name="slug"
        id="slug"
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

export function Links(props: {
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
    howrare: "",
    alphaart: "",
  });

  React.useEffect(() => {
    const initial: Record<Websites, string> = {
      discord: findLinkFor("discord", props.links) ?? "",
      website: findLinkFor("website", props.links) ?? "",
      twitter: findLinkFor("twitter", props.links) ?? "",
      instagram: findLinkFor("instagram", props.links) ?? "",
      howrare: findLinkFor("howrare", props.links) ?? "",
      alphaart: "",
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
        Links
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        {/* {props.links.map((l, i) => (
          <Link className={i > 0 ? "mt-2" : ""} link={l} />
        ))} */}
        <Link website="website" link={links.website} onChange={updateLink} />
        <Link
          website="twitter"
          className={"mt-2"}
          link={links.twitter}
          onChange={updateLink}
        />
        <Link
          website="discord"
          className={"mt-2"}
          link={links.discord}
          onChange={updateLink}
        />
        <Link
          website="instagram"
          className={"mt-2"}
          link={links.instagram}
          onChange={updateLink}
        />
        <Link
          website="howrare"
          className={"mt-2"}
          link={links.howrare}
          onChange={updateLink}
        />
      </div>
    </div>
  );
}

const SlugRegex = /^[a-z0-9-]+$/;

function Collaborators(props: {
  collaborators: string[];
  onChange?: (collaborators: string[]) => void;
}) {
  const [newCollab, setNewCollab] = React.useState("");
  const darkMode = useSelector((data) => data.darkMode);

  const onSaveNewCollab = () => {
    try {
      // new PublicKey(newCollab);
      if (props.collaborators.includes(newCollab)) {
        return;
      }
      const next = [...props.collaborators, newCollab].sort();
      props.onChange?.(next);
      setNewCollab("");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor={"input-collabrator"}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        Collaborators
      </label>
      <div className="sm:max-w-xl sm:col-span-2">
        <div className="sm:flex sm:items-center">
          <label htmlFor="emails" className="sr-only">
            Wallet ID
          </label>
          <div className="relative rounded-md shadow-sm sm:min-w-0 sm:flex-1">
            <input
              type="text"
              id="emails"
              value={newCollab}
              onChange={(e) => setNewCollab(e.currentTarget.value)}
              placeholder="Enter a wallet address"
              className="form-input block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
            <button
              onClick={onSaveNewCollab}
              className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Active Collaborators
          </h3>
          {props.collaborators.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">
              You haven’t added any team members to your project yet.
            </p>
          )}
          <ul role="list" className="mt-4 grid grid-cols-1 gap-4">
            {props.collaborators.map((person, personIdx) => (
              <li key={personIdx}>
                <div className="group p-2 w-full flex items-center justify-between rounded-md border border-gray-300 shadow-sm space-x-3 text-left ">
                  <span className="min-w-0 flex-1 flex items-center space-x-3">
                    <span className="block min-w-0 flex-1">
                      {/* <AccountName pubkey={person} /> */}
                      {darkMode ? (
                        <img
                          src="/icons/white-wallet.svg"
                          alt=""
                          className="w-full h-full"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <img
                          src="/icons/black-wallet.svg"
                          alt=""
                          className="w-full h-full"
                          width={24}
                          height={24}
                        />
                      )}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      props.onChange?.(
                        props.collaborators.filter((c) => c !== person).sort()
                      );
                    }}
                    className="flex-shrink-0 h-10 w-10 inline-flex items-center justify-center rounded-full bg-gray-200"
                  >
                    <UserRemoveIcon
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ImageEdit(props: {
  state: ImageStatus;
  original: string;
  collectionID: string;
  field: "banner" | "thumbnail";
  onChange: (next: ImageStatus) => void;
}) {
  const { wallet, accessToken } = useSelector((data) => ({
    wallet: data.wallet,
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
    fetch(
      `${API_ADDRESS}/api/v1/file/collectionupload?collection=${props.collectionID}&field=${props.field}&type=${tt}`,
      {
        method: "POST",
        headers: {
          authorization: accessToken.token,
        },
        body: form,
      }
    )
      .then((response) => response.json())
      .then((res: { url: string }) => {
        console.log(res);
        if (res.url) {
          props.onChange({ type: "new", uri: res.url });
        } else {
          addNotification("unable to upload image");
        }
        setUploading(false);
      })
      .catch((err) => {
        console.error(err);
        setUploading(false);
        addNotification("unable to upload image");
      });
  };

  const resetImage = () => {
    if (wallet?.publicKey) {
      signToken(wallet.publicKey.toBase58())
        .then(() => {
          props.onChange({ type: "reset" });
        })
        .catch((err) => {
          addNotification("unable to sign message");
        });
    }
  };
  const ss =
    props.field === "banner"
      ? "max-w-lg rounded-md h-32"
      : "h-24 w-24 rounded-full";
  const ss2 =
    props.field === "banner"
      ? "w-96 rounded-md h-32"
      : "h-24 w-24 rounded-full";
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor="photo"
        className="block text-sm font-medium text-gray-700"
      >
        {props.field === "banner" ? "Banner" : "Thumbnail"}
      </label>
      {props.state.type === "original" && (
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
              onClick={resetImage}
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
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                >
                  Upload Image
                </button>
              )}
              {uploading && <Spinner size={96} />}
            </div>
          </div>
        )}
    </div>
  );
}

export type ImageStatus =
  | { type: "original"; uri: string }
  | { type: "reset" }
  | { type: "wait-for-upload"; file: File; preview: string }
  | { type: "new"; uri: string };

function EditCollectionInner(props: {
  meta: CollectionMeta;
  reload?: (collection: Collection) => void;
}) {
  const { meta } = props;
  const { wallet } = useSelector((data) => ({
    wallet: data.wallet,
  }));
  const [nextSlug, setNextSlug] = React.useState(meta.collection?.slug!);
  const [savingInProgress, setSavingInProgress] = React.useState(false);
  const [title, setTitle] = React.useState(meta.collection?.title!);
  const [links, setLinks] = React.useState(meta.collection?.links ?? []);
  const [collaborators, setCollaborators] = React.useState(
    meta.collection?.collaborators ?? []
  );
  const [thumbnail, setThumbnail] = React.useState<ImageStatus>({
    type: "original",
    uri: meta.collection?.thumbnail!,
  });
  const [banner, setBanner] = React.useState<ImageStatus>({
    type: "original",
    uri: meta.collection?.banner!,
  });
  const [description, setDescription] = React.useState(
    meta.collection?.description ?? ""
  );

  const hasChanges =
    (nextSlug !== meta.collection?.slug ||
      title !== meta.collection?.title ||
      links.length !== meta.collection.links?.length ||
      thumbnail.type === "new" ||
      banner.type === "new" ||
      !isEqual(links, meta.collection.links?.sort()) ||
      collaborators.length !== meta.collection.collaborators?.length ||
      !isEqual(collaborators, meta.collection.collaborators?.sort()) ||
      description !== meta.collection?.description) &&
    SlugRegex.test(nextSlug);

  const saveCollection = () => {
    setSavingInProgress(true);
    const fields: string[] = [];
    const req: Collection = { id: meta.collection?.id };
    if (nextSlug !== meta.collection?.slug && SlugRegex.test(nextSlug)) {
      fields.push("slug");
      req.slug = nextSlug;
    }
    if (title !== meta.collection?.title) {
      fields.push("title");
      req.title = title;
    }
    if (description !== meta.collection?.description) {
      fields.push("description");
      req.description = description;
    }
    if (
      links.length !== meta.collection?.links?.length ||
      !isEqual(links, meta.collection?.links?.sort())
    ) {
      fields.push("links");
      req.links = links;
    }
    if (thumbnail.type === "new") {
      fields.push("thumbnail");
      req.thumbnail = thumbnail.uri;
    }
    if (banner.type === "new") {
      fields.push("banner");
      req.banner = banner.uri;
    }
    if (
      links.length !== meta.collection?.links?.length ||
      !isEqual(collaborators, meta.collection?.collaborators?.sort())
    ) {
      fields.push("collaborators");
      req.collaborators = collaborators;
    }
    updateCollection(wallet?.publicKey?.toBase58()!, fields, req)
      .then((res) => {
        addNotification("collection saved");
        setSavingInProgress(false);
        props.reload?.(res);
      })
      .catch((err) => {
        addNotification("unable to save collection", err.message ?? `${err}`);
        setSavingInProgress(false);
      });
  };

  return (
    <div className="bg-white">
      <Modal visible={savingInProgress}>
        <div className="flex flex-col items-center">
          <p>Saving...</p>
          <Spinner size={48} />
        </div>
      </Modal>
      <div className="mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Update Collection
                </h3>
              </div>

              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Slug
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        https://alpha.art/collection/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        defaultValue={meta.collection?.slug}
                        onChange={(e) => setNextSlug(e.currentTarget.value)}
                        className="form-input flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Customize your URL on alpha.art. Must only contain
                      lowercase letters, numbers, and hyphens.
                    </p>
                  </div>
                </div>
                <InputText
                  label={"Title"}
                  value={meta.collection?.title!}
                  name="title"
                  onChange={setTitle}
                />
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Description
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="form-textarea max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 bg-white rounded-md"
                      defaultValue={meta.collection?.description}
                      onChange={(e) => setDescription(e.currentTarget.value)}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Write a few sentences about the collection.
                    </p>
                  </div>
                </div>
                <Links
                  links={meta.collection?.links ?? []}
                  onChangeLinks={setLinks}
                />
                <Collaborators
                  collaborators={collaborators}
                  onChange={(c) => setCollaborators(c)}
                />
                <ImageEdit
                  field="thumbnail"
                  state={thumbnail}
                  onChange={setThumbnail}
                  collectionID={meta.collection?.id!}
                  original={meta.collection?.thumbnail!}
                />
                <ImageEdit
                  field="banner"
                  state={banner}
                  onChange={setBanner}
                  collectionID={meta.collection?.id!}
                  original={meta.collection?.banner!}
                />
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              {/* <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button> */}
              <button
                type="submit"
                disabled={!hasChanges}
                onClick={saveCollection}
                className={classNames(
                  "ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ",
                  hasChanges
                    ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                    : "bg-gray-600 "
                )}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditCollection() {
  const { slug } = useParams<{ slug: string }>();
  const [collectionMeta, isLoading] = useCollection(slug!);
  const { wallet, isConnected, user } = useSelector((data) => ({
    wallet: data.wallet,
    isConnected: data.isConnected,
    user: data.user,
  }));
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = React.useState(false);

  const reload = (coll: Collection) => {
    dispatch({
      type: "AddCollectionMeta",
      data: { ...collectionMeta, collection: coll },
    });
  };

  if (collectionMeta) {
    if (wallet && wallet.publicKey && isConnected) {
      const pk = wallet.publicKey.toBase58();
      if (
        collectionMeta.collection?.authorityPubkey === pk ||
        collectionMeta.collection?.collaborators?.includes(pk) ||
        user?.isAdmin === true
      ) {
        return <EditCollectionInner meta={collectionMeta} reload={reload} />;
      } else {
        return (
          <div className="bg-white">
            <div className="mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Update Collection
                      </h3>
                    </div>
                    <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                      <div className="flex flex-col sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <p className="font-base">
                          You are not authorized to update this collection
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="bg-white">
          <ConnectWalletDialog
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
          />
          <div className="mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Update Collection
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div className="flex flex-col sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <p className="font-base">
                        Please connect your wallet to update this collection
                      </p>
                      <button
                        type="submit"
                        onClick={() => setShowDialog(true)}
                        className={classNames(
                          "mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ",
                          "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                        )}
                      >
                        Connect Wallet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="bg-white">
        <div className="mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Update Collection
                  </h3>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"></div>
                </div>
                <Spinner size={64} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
