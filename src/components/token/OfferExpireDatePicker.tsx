import { forwardRef, Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  BiCheck as CheckIcon,
  BiSelection as SelectorIcon,
  BiCalendar as CalendarIcon,
  BiTime as ClockIcon
} from "react-icons/bi";
import { classNames } from "../../utils/clsx";
import ReactDatePicker from "react-datepicker";
import { addDays, addMonths } from "date-fns";

const dateOption = [
  { id: 1, name: "3 days" },
  { id: 2, name: "7 days" },
  { id: 3, name: "A month" },
  { id: 4, name: "Custom date" },
];

export default function OfferExpireDatePicker({
  endDate,
  onChange,
}: {
  endDate: Date;
  onChange: (date: Date) => void;
}) {
  const [selectedDateOption, setSelectedDateOption] = useState(dateOption[1]);

  useEffect(() => {
    onDateOptionChange(selectedDateOption);
  }, []);

  const setEndDate = (date: Date) => {
    onChange(date);
  };

  const onDateOptionChange = (option: { id: number; name: string }) => {
    if (option.id === 1) {
      onChange(addDays(new Date(), 3));
    } else if (option.id === 2) {
      onChange(addDays(new Date(), 7));
    } else if (option.id === 3) {
      onChange(addMonths(new Date(), 1));
    }
    setSelectedDateOption(option);
  };

  const CustomDateInput = forwardRef<any>((props: any, ref) => (
    <div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
          <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          {...props}
          className="focus:ring-indigo-500 dark:bg-zinc-700 focus:border-indigo-500 block w-full pl-9 sm:text-2xl border-gray-300 rounded-md"
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
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md dark:text-white dark:bg-zinc-700 border"
          style={{ height: 38 }}
        />
      </div>
    </div>
  ));

  return (
    <div className="flex flex-row mt-0">
      <Listbox value={selectedDateOption} onChange={onDateOptionChange}>
        <div className="mt-1 relative w-36">
          <Listbox.Button className="bg-white dark:bg-zinc-700 relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <span className="block truncate">{selectedDateOption.name}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {dateOption.map((dateOption) => (
                <Listbox.Option
                  key={dateOption.id}
                  className={({ active }) =>
                    classNames(
                      active ? "text-white bg-gray-600" : "text-gray-900",
                      "cursor-default select-none relative py-2 pl-3 pr-9"
                    )
                  }
                  value={dateOption}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "font-normal",
                          "block truncate"
                        )}
                      >
                        {dateOption.name}
                      </span>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-indigo-600",
                            "absolute inset-y-0 right-0 flex items-center pr-4"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {selectedDateOption.id === 4 && (
        <div className="ml-1 flex-1">
          <ReactDatePicker
            className={"h-9 mt-1"}
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            endDate={endDate}
            minDate={new Date()}
            nextMonthButtonLabel=">"
            previousMonthButtonLabel="<"
            timeIntervals={30}
            customInput={<CustomDateInput />}
          />
        </div>
      )}
      <div className="ml-1 flex-1">
        <ReactDatePicker
          className={"h-9 mt-1"}
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
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
  );
}
