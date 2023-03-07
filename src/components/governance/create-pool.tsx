import {
  BiChevronDown as ChevronDownIcon,
  BiCog as CogIcon,
  BiMinusCircle as MinusCircleIcon,
  BiPlusCircle as PlusCircleIcon,
  BiPlus as PlusIcon,
  BiXCircle as XCircleIcon,
  BiX as XIcon,
  BiCalendar as CalendarIcon,
  BiMinus as MinusIcon
} from "react-icons/bi";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { useSelector } from "../../api/store";
import { useWindowSize } from "../../utils/useWindowSize";

export default function CreatePool() {
  const darkMode = useSelector((data) => data.darkMode);
  const [attachedFiles, setAttachedFiles] = useState<{}[]>([{}]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [numberOfMultiselections, setNumberOfMultiselections] =
    useState<number>(0);

  const [openingDate, setOpeningDate] = useState<string>("");
  const [closingDate, setClosingDate] = useState<string>("");
  const [openedCalendar, setOpenedCalendar] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean | 0>();
  const windowSize = useWindowSize();

  useEffect(() => {
    setIsMobile(windowSize.width && windowSize.width < 481);
    console.log(windowSize.width);
  }, [windowSize]);

  function bodyCloseCalendars() {
    setOpenedCalendar("");
  }

  useEffect(() => {
    const body = document.querySelector("body");
    body?.addEventListener("click", (e) => bodyCloseCalendars());

    return () => {
      body?.removeEventListener("click", (e) => bodyCloseCalendars());
    };
  }, []);

  return (
    <div className="relative container mx-auto bg-silver dark:bg-darkgray px-4 lg:px-36 text-black py-32 text-4xl mb-12">
      {isMobile && (
        <span className="absolute top-20 right-4 flex items-center text-sm text-normal text-mediumgray dark:text-paperwhite">
          Cancel <XIcon width={24} height={24} className="ml-1 text-black" />{" "}
        </span>
      )}
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-4xl text-black">Create New Pool</h1>

        {!isMobile && (
          <Link
            to="/governance/collection-page"
            className="flex items-center text-sm text-normal text-mediumgray dark:text-paperwhite"
          >
            Cancel <XIcon width={24} height={24} className="ml-1 text-black" />{" "}
          </Link>
        )}
      </div>
      <div className="pb-6 border-b border-lightgray w-full mt-8 flex justify-between">
        <h2 className="text-lg font-medium ">Pool Settings</h2>
        <CogIcon width={24} height={24} />
      </div>

      <div className="mt-8 gap-y-8 flex flex-col">
        <div>
          <h1 className="text-lg font-medium">Question</h1>
          <h4 className="text-sm font-normal text-mediumgray dark:text-paperwhite">
            Write bellow question that you want to be asked
          </h4>
        </div>

        <div>
          <h4 className="text-sm mb-2">Pool Title</h4>
          <input
            placeholder="Title here"
            className="border border-lightgray px-3 text-sm py-2 input-shadow w-full rounded-md placeholder:text-mediumgray placeholder:text-sm flex items-center h-10 dark:bg-darkgray dark:border-darkgrayWithOpacity "
          />
        </div>
        <div>
          <h4 className="text-sm mb-2">Pool Description</h4>
          <textarea
            placeholder="Description here"
            className="resize-y border border-lightgray min-h-[4rem] px-3 text-sm py-2 input-shadow w-full rounded-md placeholder:text-mediumgray placeholder:text-sm flex items-center h-10 dark:bg-darkgray dark:border-darkgrayWithOpacity "
          ></textarea>
        </div>
        <div className="text-sm flex flex-col lg:flex-row">
          <div className="">
            <label className="mb-2">Attach file</label>
            <div className="relative bg-black dark:bg-velvet flex justify-center py-2 w-full sm:w-44 h-12 rounded-md mt-2">
              <input
                type="file"
                className=" w-full h-full bg-black dark:bg-velvet opacity-0"
              />
              <div className="w-full flex justify-center absolute top-3 pointer-events-none">
                <PlusCircleIcon
                  className="text-white dark:text-white "
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
          <div className="lg:ml-8 flex flex-col justify-between mt-4 lg:mt-0">
            <label className="">Attached files</label>
            <div className="flex flex-row flex-wrap gap-x-5 gap-y-1 opacity-70 dark:opacity-100 h-full sm:items-center mt-2 ">
              <div className="flex h-7 items-center">
                <img
                  alt="PDF"
                  src="/icons/icon-pdf.svg"
                  className={`h-full ${darkMode ? "black-icon-to-white " : ""}`}
                />
                <p className="text-black dark:text-paperwhite ml-2">
                  istock-1186882619-1.pdf
                </p>

                <XCircleIcon width={24} height={24} className="ml-2" />
              </div>
              <div className="flex h-7 items-center">
                <img
                  alt="PDF"
                  src="/icons/icon-pdf.svg"
                  className={`h-full ${darkMode ? "black-icon-to-white" : ""}`}
                />
                <p className="text-black dark:text-paperwhite ml-2">
                  istock-1186882619-1.pdf
                </p>

                <XCircleIcon width={24} height={24} className="ml-2" />
              </div>
              <div className="flex h-7 items-center">
                <img
                  alt="PDF"
                  src="/icons/icon-pdf.svg"
                  className={`h-full ${darkMode ? "black-icon-to-white" : ""}`}
                />
                <p className="text-black dark:text-paperwhite ml-2">
                  istock-1186882619-1.pdf
                </p>

                <XCircleIcon width={24} height={24} className="ml-2" />
              </div>
            </div>
          </div>
        </div>

        <hr className="w-full border-top border-lightgray dark:border-darkgrayWithOpacity h-0"></hr>

        <div>
          <h4 className="mb-2 text-lg font-medium">Pool Options</h4>
          <div className="mb-2 mt-4">
            <h4 className="text-sm mb-2">Answer</h4>
            <div className="flex">
              <input
                placeholder="Title here"
                className="appearance-none border border-lightgray px-3 text-sm py-2 input-shadow w-full rounded-md placeholder:text-mediumgray placeholder:text-sm flex items-center h-10 dark:bg-darkgray dark:border-darkgrayWithOpacity"
              />
              <div className="flex items-center px-7 border border-lightgray rounded-md bg-white ml-8 dark:bg-darkgray dark:border-darkgrayWithOpacity">
                <MinusCircleIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="mb-2 mt-4">
            <h4 className="text-sm mb-2">Answer</h4>
            <div className="flex">
              <input
                placeholder="Title here"
                className="border border-lightgray px-3 text-sm py-2 input-shadow w-full rounded-md placeholder:text-mediumgray placeholder:text-sm flex items-center h-10 dark:bg-darkgray dark:border-darkgrayWithOpacity"
              />
              <div className="flex items-center px-7 border border-lightgray rounded-md bg-white ml-8 dark:bg-darkgray dark:border-darkgrayWithOpacity">
                <MinusCircleIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-y-6">
          <button className="bg-black dark:bg-velvet flex justify-center items-center text-white dark:text-paperwhite h-12 rounded-md mt-2 text-base px-4 sm:w-60">
            Add Pool Option
            <PlusCircleIcon className=" ml-3" width={24} height={24} />
          </button>
          <div className="flex flex-col sm:flex-row xl:ml-4 gap-x-4 md:gap-x-10">
            <div className="flex xl:ml-10">
              <input
                className={`form-check-input appearance-none rounded-full h-4 w-4 border-gray-300 bg-white dark:bg-darkgray focus:outline-none transition duration-100 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${selectedOption === "option2"
                    ? "dark:bg-paperwhite border-blue-600 dark:border-blue-600 border-4"
                    : "border"
                  } ${darkMode && selectedOption !== "option2"
                    ? "dark:border-darkgrayWithOpacity"
                    : ""
                  }`}
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={selectedOption === "option2"}
                onChange={() => {
                  setSelectedOption("option2");
                }}
              />
              <div className="">
                <p className="font-medium text-sm text-black">
                  Option is single select
                </p>
                <p className="text-sm text-mediumgray dark:text-paperwhite opacity-50 w-[250px] dark:opacity-100">
                  If using single select, then this question can have only
                  single pool option.
                </p>
              </div>
            </div>
            <div className="flex xl:ml-10 z-0">
              <input
                className={`form-check-input appearance-none rounded-full h-4 w-4 border-gray-300 bg-white dark:bg-darkgray focus:outline-none transition duration-100 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${selectedOption === "option1"
                    ? "dark:bg-paperwhite border-blue-600 dark:border-blue-600 border-4"
                    : "border"
                  } ${darkMode && selectedOption !== "option1"
                    ? "dark:border-darkgrayWithOpacity"
                    : ""
                  }`}
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={selectedOption === "option1"}
                onChange={() => {
                  setSelectedOption("option1");
                }}
              />
              <div className="">
                <p className="font-medium text-sm text-black">
                  Option is multiple select
                </p>
                <p className="text-sm text-mediumgray opacity-50 w-[250px] dark:text-paperwhite dark:opacity-100">
                  If using multiple select, then this question can have multiple
                  pool options.
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr className="w-full border-top border-lightgray dark:border-darkgrayWithOpacity h-0"></hr>

        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <p className="font-medium text-lg text-black">Input Field</p>
            <p className="text-sm text-mediumgray dark:text-paperwhite opacity-50 dark:opacity-100">
              Maximum number off allowed multiselection
            </p>
          </div>
          <div className="flex items-end justify-between sm:justify-start mt-6 sm:mt-0">
            <div className="flex">
              <button
                className="bg-black dark:bg-velvet dark:text-paperwhite flex justify-center items-center text-white w-[88px] h-10 rounded-md mt-2 text-base px-4"
                onClick={() =>
                  numberOfMultiselections !== 0 &&
                  setNumberOfMultiselections(numberOfMultiselections - 1)
                }
              >
                <MinusIcon className="w-5 h-5 " />
              </button>
              <button
                className="bg-black dark:bg-velvet flex justify-center items-center text-white dark:text-paperwhite w-[88px] h-10 rounded-md mt-2 text-base px-4"
                onClick={() =>
                  setNumberOfMultiselections(numberOfMultiselections + 1)
                }
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            <input
              value={numberOfMultiselections}
              onChange={(e) =>
                setNumberOfMultiselections(Number(e.target.value))
              }
              className="w-20 text-sm text-black dark:text-black text-center h-10 ml-8 border border-lightgray dark:bg-white rounded-md"
            />
          </div>
        </div>
        <hr className="w-full border-top border-lightgray dark:border-darkgrayWithOpacity h-0"></hr>

        <div className="">
          <p className="font-medium text-lg text-black">Pool timeframe</p>
          <div className="flex mt-6 flex-col sm:flex-row gap-y-6 sm:gap-y-0">
            <div className="flex">
              <input
                className={`form-check-input appearance-none rounded-full h-4 w-4 border-gray-300 bg-white dark:bg-darkgray focus:outline-none transition duration-100 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${selectedOption === "option1"
                    ? "dark:bg-paperwhite border-blue-600 dark:border-blue-600 border-4"
                    : "border"
                  } ${darkMode && selectedOption !== "option1"
                    ? "dark:border-darkgrayWithOpacity"
                    : ""
                  }`}
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={selectedOption === "option1"}
                onChange={() => {
                  setSelectedOption("option1");
                }}
              />
              <div className="">
                <p className="font-medium text-sm text-black">Pool start</p>
                <p className="text-sm text-mediumgray dark:text-paperwhite opacity-50 dark:opacity-100 w-[250px]">
                  As soon as pool is created
                </p>
              </div>
            </div>
            <div className="flex sm:ml-10 z-0">
              <input
                className={`form-check-input appearance-none rounded-full h-4 w-4 border-gray-300 bg-white dark:bg-darkgray focus:outline-none transition duration-100 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${selectedOption === "option1"
                    ? "dark:bg-paperwhite border-blue-600 dark:border-blue-600 border-4"
                    : "border"
                  } ${darkMode && selectedOption !== "option1"
                    ? "dark:border-darkgrayWithOpacity"
                    : ""
                  }`}
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={selectedOption === "option1"}
                onChange={() => {
                  setSelectedOption("option1");
                }}
              />
              <div className="">
                <p className="font-medium text-sm text-black">Pool end</p>
                <p className="text-sm text-mediumgray opacity-50 w-[250px] dark:opacity-100 dark:text-paperwhite">
                  Admin decide ending time
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row  gap-y-6 sm:gap-y-0">
          <div className="flex">
            <input
              className={`form-check-input appearance-none rounded-full h-4 w-4 border-gray-300 bg-white dark:bg-darkgray focus:outline-none transition duration-100 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${selectedOption === "option1"
                  ? "dark:bg-paperwhite border-blue-600 dark:border-blue-600 border-4"
                  : "border"
                } ${darkMode && selectedOption !== "option1"
                  ? "dark:border-darkgrayWithOpacity"
                  : ""
                }`}
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              checked={selectedOption === "option1"}
              onChange={() => {
                setSelectedOption("option1");
              }}
            />
            <div className="relative">
              <p className="font-medium text-sm text-black">
                Custom date and time
              </p>

              <div
                className={`flex cursor-pointer text-sm opacity-50 w-[250px] dark:text-paperwhite items-center relative dark:opacity-100 ${openingDate ? "text-black opacity-100" : "text-mediumgray"
                  } mt-2 `}
                onClick={(e) => {
                  e.stopPropagation();
                  openedCalendar !== "openingCalendar"
                    ? setOpenedCalendar("openingCalendar")
                    : setOpenedCalendar("");
                }}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Opening on {openingDate}
                <ChevronDownIcon
                  className={`w-5 h-5 ml-2 ${openedCalendar === "openingCalendar" ? "rotate-180" : ""
                    }`}
                />
              </div>
              <div className="pool-datepicker z-50 absolute top-12">
                <ReactDatePicker
                  selected={openingDate ? new Date(openingDate) : new Date()}
                  onChange={(date: Date) => {
                    setOpeningDate(new Date(date).toDateString());
                    setOpenedCalendar("");
                  }}
                  dateFormat={"d MMMM yyyy"}
                  nextMonthButtonLabel=">"
                  previousMonthButtonLabel="<"
                  timeIntervals={30}
                  className="z-50 text-xl text-black rounded-lg px-4 bg-silver hidden"
                  open={openedCalendar === "openingCalendar"}
                ></ReactDatePicker>
              </div>
            </div>
          </div>
          <div className="flex sm:ml-10">
            <input
              className={`form-check-input appearance-none rounded-full h-4 w-4 border-gray-300 bg-white dark:bg-darkgray focus:outline-none transition duration-100 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${selectedOption === "option1"
                  ? "dark:bg-paperwhite border-blue-600 dark:border-blue-600 border-4"
                  : "border"
                } ${darkMode && selectedOption !== "option1"
                  ? "dark:border-darkgrayWithOpacity"
                  : ""
                }`}
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              checked={selectedOption === "option1"}
              onChange={() => {
                setSelectedOption("option1");
              }}
            />
            <div className="relative z-50">
              <p className="font-medium text-sm text-black">
                Custom date and time
              </p>
              <div
                className={`flex cursor-pointer text-sm  w-[250px] items-center relative dark:text-paperwhite dark:opacity-100 ${closingDate
                    ? "text-black opacity-100"
                    : "text-mediumgray opacity-50"
                  }  mt-2 `}
                onClick={(e) => {
                  e.stopPropagation();
                  openedCalendar !== "closingCalendar"
                    ? setOpenedCalendar("closingCalendar")
                    : setOpenedCalendar("");
                }}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Closing on {closingDate}
                <ChevronDownIcon
                  className={`w-5 h-5 ml-2 ${openedCalendar === "closingCalendar" ? "rotate-180" : ""
                    }`}
                />
              </div>
              <div className="pool-datepicker z-50 absolute top-12">
                <ReactDatePicker
                  selected={closingDate ? new Date(closingDate) : new Date()}
                  onChange={(date: Date) =>
                    setClosingDate(new Date(date).toDateString())
                  }
                  dateFormat={"d MMMM yyyy"}
                  nextMonthButtonLabel=">"
                  previousMonthButtonLabel="<"
                  timeIntervals={30}
                  className="z-50 text-xl text-black rounded-lg px-4 bg-silver hidden bg-velvet"
                  open={openedCalendar == "closingCalendar"}
                ></ReactDatePicker>
              </div>
            </div>
          </div>
        </div>
        <hr
          className={`w-full border-top border-lightgray dark:border-darkgrayWithOpacity h-0 `}
        ></hr>
        <div
          className={`w-full flex justify-center sm:justify-end items-center`}
        >
          <button className="bg-black dark:bg-velvet dark:text-white flex justify-center py-2 w-40 h-12 rounded-md mt-2 text-white text-base items-center">
            Create pool
          </button>
        </div>
      </div>
    </div>
  );
}
