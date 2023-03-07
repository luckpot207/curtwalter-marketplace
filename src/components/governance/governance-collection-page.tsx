import {
  BiChevronDown as ChevronDownIcon,
  BiPlusCircle as PlusCircleIcon,
  BiXCircle as XCircleIcon,
  BiCheckCircle as CheckCircleIcon,
  BiChevronUp as ChevronUpIcon,
} from "react-icons/bi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "../../api/store";
import { useWindowSize } from "../../utils/useWindowSize";
import Modal from "../dialog";
import TokenGalleryItem, { GalleryItem } from "./token-gallery-item";

export enum betOptions {
  BET_WITH_ALL = "BET_WITH_ALL",
  BET_WITH_SELECTED_TOKENS = "BET_WITH_SELECTED_TOKENS",
}

export default function GovernanceCollectionPage() {
  const [expandedRowIds, setExpandedRowIds] = useState<Number[]>([]);
  const [tokenBetOption, setTokenBetOption] = useState<betOptions>();
  const [isMobile, setIsMobile] = useState<boolean | 0>();

  const windowSize = useWindowSize();
  const darkMode = useSelector((data) => data.darkMode);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [voteModal, setVoteModal] = useState(false);

  useEffect(() => {
    let array: GalleryItem[] = [];
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item, index) => {
      array.push({
        id: index,
        src: "/img/image-holder.png",
        slug: "",
        staked: false,
        name: "Money holder",
      });
    });
    setGalleryItems(array);
  }, []);

  function collapseRow(id: Number) {
    if (expandedRowIds.includes(id)) {
      let newArray = expandedRowIds.slice();
      const index = expandedRowIds.indexOf(id);
      newArray.splice(index, 1);
      setExpandedRowIds(newArray);
    }
  }

  function handleItemClick(item: GalleryItem, index: number) {
    if (!selectMode) {
      setSelectMode(true);
    } else {
      if (!selectedTokens.includes(item.id)) {
        setSelectedTokens([...selectedTokens, item.id]);
      } else if (selectedTokens.includes(item.id)) {
        const index = selectedTokens.indexOf(item.id);
        let slicedArray = selectedTokens.slice();
        slicedArray.splice(index, 1);
        setSelectedTokens(slicedArray);
      }
    }
  }

  useEffect(() => {
    setIsMobile(windowSize.width && windowSize.width < 481);
  }, [windowSize]);

  return (
    <div className="relative container mx-auto overflow-hidden px-4 lg:px-0 text-black py-32 text-4xl">
      <h1 className="font-bold text-4xl mb-8 sm:mb-14">Collection Page</h1>

      <div className="pb-4 border-b border-gray dark:border-paperwhite border-solid w-full justify-between items-center dark:text-paperwhite flex">
        <p className="font-medium text-lg text-velvet dark:text-paperwhite">
          Pools
        </p>
        <div className="flex text-sm">
          <div className="flex gap-7 text-black md:mr-32 items-center">
            <p>Website</p>
            <p>Discord</p>
            <p>Twitter</p>
          </div>
          <Link
            to="/governance/collection-page/create-pool"
            className="hidden md:flex w-max items-center bg-velvet text-white dark:text-paperwhite py-3 px-7 rounded-lg "
          >
            <span className="w-max mr-3">New Pool</span>{" "}
            <PlusCircleIcon width={24} height={24} />
          </Link>
        </div>
      </div>
      <Link
        to="/governance/collection-page/create-pool"
        className="flex md:hidden w-full items-center justify-center bg-velvet text-white dark:text-paperwhite py-3 px-7 rounded-lg mt-4 "
      >
        <span className="w-max mr-3 text-base">New Pool</span>{" "}
        <PlusCircleIcon width={24} height={24} />
      </Link>
      {voteModal && (
        <Modal visible={voteModal} onClose={() => setVoteModal(false)}>
          <div
            className={`bg-silver dark:bg-black rounded-t-lg cursor-pointer flex flex-col justify-center ${selectMode ? "custom-border-lightgray" : ""
              }`}
          >
            <div className="grid grid-cols-3 rounded-lg gap-4 h-[350px] overflow-y-auto overflow-x-hidden no-scrollbar p-4">
              {galleryItems.map((item, k) => (
                <div
                  onClick={() => handleItemClick(item, k)}
                  className=""
                  key={k}
                >
                  <TokenGalleryItem
                    item={galleryItems[k]}
                    isModal
                    classSelected={selectedTokens.includes(item.id)}
                    readyForSelection={
                      selectMode && !selectedTokens.includes(item.id)
                        ? true
                        : false
                    }
                  />
                </div>
              ))}
            </div>
            {selectMode && (
              <div className="w-full flex justify-center pb-5 mt-6">
                <div className="pl-2 w-full">
                  <button
                    className="w-full bg-black dark:bg-velvet text-white dark:text-white flex items-center justify-center rounded-[4px] h-9"
                    onClick={() => setVoteModal(false)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
      <div
        className={`w-full flex flex-col md:flex-row mt-10 sm:mt-24 dark:text-paperwhite`}
      >
        <div className="w-full lg:w-3/4 ">
          {windowSize.width && windowSize.width > 719 && (
            <div className="w-full dark:bg-darkgray text-xs border border-lightgray rounded-lg  hidden md:flex">
              <span className="py-2 pl-4 text-left w-1/2">Title</span>
              <span className="py-2 text-left w-1/5">Voted</span>
              <span className="py-2 text-left pr-4 w-1/12">Status</span>
              <span className="py-2 pr-4 text-left w-1/4">Action</span>
            </div>
          )}
          <div
            className={`mt-4 flex flex-col sm:flex-row h-auto md:h-24 text-sm  border-lightgray rounded-t-lg dark:bg-darkgray  dark:border-paperwhite ${!darkMode
              ? "border"
              : darkMode && expandedRowIds.includes(2)
                ? "border-b"
                : ""
              } ${expandedRowIds.includes(2)
                ? "border-b-0 rounded-t-lg"
                : "rounded-lg"
              }`}
          >
            <div
              className={`pl-4 w-full md:w-1/2 flex flex-col items-start max-w justify-center ${isMobile && !expandedRowIds.includes(2)
                ? "card-drop-small-shadow"
                : ""
                } ${!isMobile ? "max-width-66" : ""}`}
            >
              {isMobile && expandedRowIds.includes(2) && (
                <span className="py-2 text-left w-2/3">Title</span>
              )}
              {isMobile && !expandedRowIds.includes(2) && (
                <div className="w-1/12 pt-4 pb-2 flex items-center">
                  <div className="bg-velvet dark:bg-paperwhite  text-white px-2 py-1 h-5 text-center rounded-3xl flex items-center justify-center text-xs font-medium">
                    {" "}
                    Live
                  </div>
                </div>
              )}
              <div className="overflow-hidden block sm:w-4/5">
                <h2 className="text-lg font-extrabold underline lines-1 truncate text-ellipsis max-w-full">
                  Mundo Sanshez - DAO Ambassador
                </h2>
              </div>

              {!expandedRowIds.includes(2) && isMobile && (
                <div className="w-full h-6 flex justify-center text-black mt-3 mb-3">
                  <ChevronDownIcon
                    width={24}
                    height={24}
                    className="flex"
                    onClick={() => setExpandedRowIds([...expandedRowIds, 2])}
                  />
                </div>
              )}
              {(expandedRowIds.includes(2) || !isMobile) && (
                <h4 className="text-xs font-semibold text-velvet dark:text-paperwhite overflow-hidden block sm:w-4/5">
                  From / March 6. 2022 / 08:54:27
                  <br className="flex sm:hidden"></br> to March 6. 2022 /
                  08:54:27{" "}
                </h4>
              )}
            </div>
            {isMobile && expandedRowIds.includes(2) && (
              <div className="flex pl-4 sm:pl-0">
                <span className="py-2 text-left w-3/5">Voted </span>
                <span className="py-2 text-left w-2/5">Status</span>
              </div>
            )}
            <span className="text-lg font-extrabold w-full sm:w-1/5 flex items-center sm:-ml-2 pl-4 sm:pl-0">
              {(expandedRowIds.includes(2) || !isMobile) && (
                <h2 className="w-3/5 sm:w-full">10000 / 99999</h2>
              )}
              {isMobile && expandedRowIds.includes(2) && (
                <div className="w-2/5 h-full">
                  <div className="bg-velvet dark:bg-paperwhite text-white dark:text-velvet px-2 py-2 h-5 text-center rounded-3xl flex items-center justify-center text-xs font-medium w-1/3">
                    Live
                  </div>
                </div>
              )}
            </span>
            {!isMobile && (
              <div className="w-1/12 py-4 flex items-center">
                <div className="bg-velvet dark:bg-paperwhite text-white dark:text-velvet px-2 py-1 h-5 text-center rounded-3xl mr-4 my-4 flex items-center justify-center text-xs font-medium">
                  {" "}
                  Live
                </div>
              </div>
            )}
            {!isMobile || (expandedRowIds.includes(2) && isMobile) ? (
              <div
                className={`w-full sm:w-1/4 pl-4 sm:pl-0 flex items-center mt-6 sm:mt-0 mb-2 pr-4 sm:mb-0 ${!expandedRowIds.includes(2)
                  ? "justify-end"
                  : "justify-between"
                  }`}
              >
                {isMobile && expandedRowIds.includes(2) && (
                  <span className="py-2 pr-4 text-left w-3/5">Action</span>
                )}
                {expandedRowIds.includes(2) && (
                  <div className="flex">
                    <CheckCircleIcon
                      className="mr-8 text-velvet "
                      width={24}
                      height={24}
                    />
                    <XCircleIcon
                      className="mr-8 text-lightgray"
                      width={24}
                      height={24}
                    />
                  </div>
                )}

                {expandedRowIds.includes(2) ? (
                  <ChevronUpIcon
                    width={24}
                    height={24}
                    className="hidden sm:flex"
                    onClick={() => collapseRow(2)}
                  />
                ) : (
                  <ChevronDownIcon
                    width={24}
                    height={24}
                    className="hidden sm:flex"
                    onClick={() => setExpandedRowIds([...expandedRowIds, 2])}
                  />
                )}
              </div>
            ) : null}
          </div>

          {expandedRowIds.includes(2) && (
            <div
              className={`pt-8 px-0 sm:px-14 pb-4 w-full text-sm border border-lightgray rounded-b-lg dark:bg-darkgray ${windowSize.width && windowSize.width > 767 && !darkMode
                ? "card-drop-small-shadow"
                : ""
                }`}
            >
              <div className="px-4 sm:px-0">
                <h2 className="text-lg font-bold mb-2">Pool Description</h2>
                <p className="mb-7 text-sm">
                  That Mundo Sanchez replace Mills as DAO Ambassador Customize
                  the native select with custom CSS that changes the element’s
                  initial appearance.That Mundo Sanchez replace Mills as DAO
                  Ambassador Customize the native select with custom CSS that
                  changes the element’s initial appearance.That Mundo Sanchez
                  replace Mills as DAO Ambassador Customize the native select
                  with custom CSS that changes the element’s initial appearance.
                </p>

                <h2 className="mb-4 text-lg">Attachments in file</h2>

                <div className="flex flex-col gap-y-3">
                  <div className="flex">
                    <img
                      alt="PDF"
                      src="/icons/icon-pdf.svg"
                      className={`${darkMode ? "black-icon-to-white" : ""}`}
                    />
                    istock-1186882619-1.pdf
                  </div>
                  <div className="flex">
                    <img
                      alt="PDF"
                      src="/icons/icon-pdf.svg"
                      className={`${darkMode ? "black-icon-to-white" : ""}`}
                    />
                    istock-1186882619-1.pdf
                  </div>
                  <div className="flex">
                    <img
                      alt="PDF"
                      src="/icons/icon-pdf.svg"
                      className={`${darkMode ? "black-icon-to-white" : ""}`}
                    />
                    istock-1186882619-1.pdf
                  </div>
                </div>
              </div>
              <div className="px-4 sm:px-0 pb-6 pt-8 border-b border-t border-gray dark:border-paperwhite border-solid mt-6">
                <h2 className="text-lg font-bold mb-4 sm:mb-2">Pool Options</h2>
                <div className="flex w-full">
                  <div className="flex flex-col w-full">
                    <div className="mb-4 w-full flex flex-col sm:flex-row justify-between">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <button className="w-full sm:w-auto py-3 px-9 bg-velvet flex text-white dark:text-paperwhite items-center justify-center rounded-lg mr-4 mb-1 sm:mb-0">
                          For{" "}
                          <CheckCircleIcon
                            className="ml-3"
                            width={24}
                            height={24}
                          />
                        </button>
                        <p className="text-lg font-bold mb-2 sm:mb-0">
                          Option 1 Description
                        </p>
                      </div>
                      <div className="">
                        <p className="text-black font-bold w-24 text-left">
                          99.9999 votes
                        </p>
                        <p className="text-darkgray dark:text-paperwhite font-light">
                          99.2%
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                        <button className="w-full sm:w-auto py-3 px-10 text-black text-center justify-cengter rounded-lg border border-black mr-4 mb-1 sm:mb-0">
                          Against
                        </button>
                        <p className="text-lg font-bold mb-2 sm:mb-0">
                          Option 2 Description
                        </p>
                      </div>
                      <div className="">
                        <p className="text-black font-bold w-24 text-left">
                          9 votes
                        </p>
                        <p className="text-darkgray dark:text-paperwhite font-light">
                          08.2%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 px-4 sm:px-0">
                <h2 className="text-lg font-bold mb-4 sm:mb-0">
                  Voting options
                </h2>
                <span className="flex flex-col sm:flex-row justify-between">
                  <div className="form-check flex items-center mb-4 sm:mb-0">
                    <input
                      className={`form-check-input appearance-none rounded-full h-4 w-4 border-gray-300 bg-white dark:bg-darkgray focus:outline-none transition duration-100 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${tokenBetOption === betOptions.BET_WITH_ALL
                        ? "dark:bg-paperwhite border-blue-600 dark:border-blue-600 border-4"
                        : "border"
                        } ${darkMode && tokenBetOption !== betOptions.BET_WITH_ALL
                          ? "dark:border-paperwhite"
                          : ""
                        }`}
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      checked={tokenBetOption === betOptions.BET_WITH_ALL}
                      onChange={() => {
                        setTokenBetOption(betOptions.BET_WITH_ALL);
                      }}
                    />
                    <label
                      className={`form-check-label inline-block text-black mt-1 ${tokenBetOption === betOptions.BET_WITH_ALL
                        ? "underline"
                        : "no-underline"
                        }`}
                    >
                      Vote with all tokens
                    </label>
                  </div>
                  <div className="form-check flex items-center mb-1 sm:mb-0">
                    <input
                      className={`form-check-input appearance-none rounded-full h-4 w-4 border-gray-300 bg-white dark:bg-darkgray focus:outline-none transition duration-100 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${tokenBetOption === betOptions.BET_WITH_SELECTED_TOKENS
                        ? "dark:bg-paperwhite border-blue-600 dark:border-blue-600 border-4"
                        : "border "
                        } ${darkMode &&
                          tokenBetOption !== betOptions.BET_WITH_SELECTED_TOKENS
                          ? "dark:border-paperwhite"
                          : ""
                        }`}
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      checked={
                        tokenBetOption === betOptions.BET_WITH_SELECTED_TOKENS
                      }
                      onChange={() => {
                        setTokenBetOption(betOptions.BET_WITH_SELECTED_TOKENS);
                      }}
                      onClick={() => setVoteModal(true)}
                    />
                    <label
                      className={`form-check-label inline-block text-black mt-1 ${tokenBetOption === betOptions.BET_WITH_SELECTED_TOKENS
                        ? "underline"
                        : "no-underline"
                        }`}
                    >
                      Vote with selected tokens
                    </label>
                  </div>
                  <p className="ml-6 sm:ml-0 text-gray-500">
                    You have selected{" "}
                    <span className="text-velvet">#number</span> of tokens to
                    vote
                  </p>
                </span>
              </div>
              <div className="px-4 sm:px-0">
                <button className="w-full bg-black dark:bg-velvet text-white dark:text-paperwhite flex text-center justify-center py-3 rounded-lg mt-16 ">
                  Vote
                </button>
              </div>
              {isMobile && (
                <div className="w-full h-6 flex justify-center text-black mb-2 mt-14">
                  <ChevronUpIcon
                    width={24}
                    height={24}
                    className=""
                    onClick={() => collapseRow(2)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-1/4 pl-8 hidden lg:flex ">
          <div className="text-lg font-bold flex flex-col gap-2">
            <h2 className="">
              Treasury <span className="text-velvet">65,000 USD</span>
            </h2>
            <div
              className={`bg-silver flex p-2 mb-2 rounded-lg dark:bg-darkgray cursor-pointer ${darkMode ? "purple-border-hover" : "gray-border-hover"
                }`}
            >
              <img
                src="/img/image-holder.png"
                alt="holder"
                width={60}
                height={60}
                className="mr-2"
              />
              <div className="text-sm">
                <h4 className="font-bold">Generous Robots DAO</h4>
                <p className="font-normal">AbC1Xyz827kj86</p>
                <p className="text-velvet">90.000</p>
              </div>
            </div>
            <div
              className={`bg-silver flex p-2 mb-2 rounded-lg dark:bg-darkgray cursor-pointer ${darkMode ? "purple-border-hover" : "gray-border-hover"
                }`}
            >
              <img
                src="/img/image-holder.png"
                alt="holder"
                width={60}
                height={60}
                className="mr-2"
              />
              <div className="text-sm">
                <h4 className="font-bold">Generous Robots DAO</h4>
                <p className="font-normal">AbC1Xyz827kj86</p>
                <p className="text-velvet">90.000</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <h1>Council / Ambasadors</h1>
              <div
                className={`bg-silver flex p-2 mb-2 rounded-lg dark:bg-darkgray cursor-pointer ${darkMode ? "purple-border-hover" : "gray-border-hover"
                  }`}
              >
                <img
                  src="/img/image-holder.png"
                  alt="holder"
                  width={60}
                  height={60}
                  className="mr-2"
                />
                <div className="text-sm">
                  <h4 className="font-bold">Generous Robots DAO</h4>
                  <p className="font-normal">AbC1Xyz827kj86</p>
                </div>
              </div>
              <div
                className={`bg-silver flex p-2 mb-2 rounded-lg dark:bg-darkgray cursor-pointer ${darkMode ? "purple-border-hover" : "gray-border-hover"
                  }`}
              >
                <img
                  src="/img/image-holder.png"
                  alt="holder"
                  width={60}
                  height={60}
                  className="mr-2"
                />
                <div className="text-sm">
                  <h4 className="font-bold">Generous Robots DAO</h4>
                  <p className="font-normal">AbC1Xyz827kj86</p>
                </div>
              </div>
              <div
                className={`bg-silver flex p-2 mb-2 rounded-lg dark:bg-darkgray cursor-pointer ${darkMode ? "purple-border-hover" : "gray-border-hover"
                  }`}
              >
                <img
                  src="/img/image-holder.png"
                  alt="holder"
                  width={60}
                  height={60}
                  className="mr-2"
                />
                <div className="text-sm">
                  <h4 className="font-bold">Generous Robots DAO</h4>
                  <p className="font-normal">AbC1Xyz827kj86</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h1 className="mb-2">Staking</h1>
              <div
                className={`bg-silver dark:bg-darkgray rounded-t-lg p-4 cursor-pointer ${selectMode ? "border border-lightgray dark:border-velvet" : ""
                  }`}
              >
                <div className="grid grid-cols-3 gap-4 h-[350px] overflow-y-auto overflow-x-hidden no-scrollbar">
                  {galleryItems.map((item, k) => (
                    <div
                      onClick={() => handleItemClick(item, k)}
                      className="!border-velvet border-solid"
                      key={k}
                    >
                      <TokenGalleryItem
                        item={galleryItems[k]}
                        classSelected={selectedTokens.includes(item.id)}
                        isModal={false}
                        readyForSelection={
                          selectMode && !selectedTokens.includes(item.id)
                            ? true
                            : false
                        }
                      />
                    </div>
                  ))}
                </div>
                {selectMode && (
                  <div className="w-full flex justify-center pb-5 mt-6">
                    <div className="pr-2 w-1/3 ">
                      <button
                        className="w-full bg-transparent text-black border border-black dark:border-paperwhite rounded-[4px] flex items-center justify-center h-9"
                        onClick={() => setSelectMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="pl-2 w-2/3">
                      <button className="w-full bg-black dark:bg-velvet text-white dark:text-white flex items-center justify-center rounded-[4px] h-9">
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
