import { BiFile as DocumentRemoveIcon } from "react-icons/bi";
import React from "react";

export function CandyMachineIds(props: {
  candyIds: string[];
  onChange?: (candyIds: string[]) => void;
}) {
  const [newCandyId, setNewCandyId] = React.useState("");
  const onSaveNewCandyId = () => {
    try {
      // new PublicKey(newCandyId);
      if (props.candyIds.includes(newCandyId)) {
        return;
      }
      const next = [...props.candyIds, newCandyId].sort();
      props.onChange?.(next);
      setNewCandyId("");
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
        Candy Machine Ids
      </label>
      <div className="sm:max-w-xl sm:col-span-2">
        <div className="sm:flex sm:items-center">
          <label htmlFor="emails" className="sr-only">
            Candy Machine Id
          </label>
          <div className="relative rounded-md shadow-sm sm:min-w-0 sm:flex-1">
            <input
              type="text"
              id="emails"
              value={newCandyId}
              onChange={(e) => setNewCandyId(e.currentTarget.value)}
              placeholder="Enter a candy machine id"
              className="form-input block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
            <button
              type="button"
              onClick={onSaveNewCandyId}
              className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 nightwind-prevent"
            >
              Add
            </button>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Candy Machine Ids
          </h3>
          {props.candyIds.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">
              You haven’t added any candy machine id yet.
            </p>
          )}
          <ul role="list" className="mt-4 grid grid-cols-1 gap-4">
            {props.candyIds.map((person, personIdx) => (
              <li key={personIdx}>
                <div className="group p-2 w-full flex items-center justify-between rounded-md border border-gray-300 shadow-sm space-x-3 text-left ">
                  <span className="min-w-0 flex-1 flex items-center space-x-3">
                    <span className="block min-w-0 flex-1">{person}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      props.onChange?.(
                        props.candyIds.filter((c) => c !== person).sort()
                      );
                    }}
                    className="flex-shrink-0 h-10 w-10 inline-flex items-center justify-center rounded-full bg-gray-200"
                  >
                    <DocumentRemoveIcon
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
