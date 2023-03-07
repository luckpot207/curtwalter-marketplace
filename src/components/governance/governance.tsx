import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useSelector } from "../../api/store";

export default function Governance() {
  const darkMode = useSelector((data) => data.darkMode);
  const [gridColsValue, setGridColsValue] = useState(1);

  // Listener that calculated how much items will be in single collection row
  React.useEffect(() => {
    const collectionDivElement = document.getElementById(
      "governance-collection-wrapper"
    );
    setGridColsValue(
      Math.floor(Number(collectionDivElement?.offsetWidth) / 280)
    );
    function handleResize() {
      setGridColsValue(
        Math.floor(Number(collectionDivElement?.offsetWidth) / 280)
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div className="bg-white">
      <Helmet>
        <title>{`Governance`}</title>
      </Helmet>
      <div className="relative container mx-auto overflow-hidden px-4 sm:px-6 lg:px-8 text-black py-32 text-4xl">
        <h1 className="mb-4 font-bold">Collection Governance</h1>
        <div
          className={`grid grid-cols-${gridColsValue} gap-x-6 gap-y-4`}
          id="governance-collection-wrapper"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, k) => (
            <div key={k}>
              <GovernanceCollection
                img="/img/image-holder.png"
                title="Gator #399"
                admin
                locked
                id={46}
                symbol=""
                slug=""
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GovernanceCollection(props: {
  img: string;
  admin: boolean;
  locked: boolean;
  id: number;
  title: string;
  symbol: string;
  slug: string;
}) {
  const darkMode = useSelector((data) => data.darkMode);

  return (
    <li
      key={props.id}
      className={`w-full lg:w-72 lg:h-96 inline-flex flex-col text-center bg-silver dark:bg-darkgray rounded-3xl p-3 ${
        darkMode ? "purple-border-hover" : "gray-border-hover"
      } `}
    >
      <div className="group relative h-full flex flex-col justify-between">
        <div className="w-full bg-gray-200 rounded-3xl overflow-hidden relative ">
          <img
            src={props.img}
            alt={props.title}
            className="w-full h-full object-center object-cover group-hover:opacity-75"
          />
          {props.admin && (
            <div className="absolute flex justify-center items-center top-4 left-4 bg-velvet text-white dark:text-white uppercase w-min h-8 text-xs font-bold px-2 rounded-full">
              Admin
            </div>
          )}

          {props.locked ? (
            <div className="absolute flex justify-center items-center top-4 right-4 bg-velvet text-white uppercase w-min h-8 text-xs font-bold px-6 rounded-full">
              <img
                alt="locked"
                src="/icons/icon-locked.svg"
                className="w-6 h-6 min-w-max"
              />
            </div>
          ) : (
            <div className="absolute flex justify-center items-center top-4 right-4 bg-velvet text-white uppercase w-min h-8 text-xs font-bold px-6 rounded-full">
              <img
                alt="locked"
                src="/icons/icon-unlocked.svg"
                className="w-6 h-6 min-w-max"
              />
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">{props.symbol}</p>
          <h3 className="mt-1 font-semibold text-gray-900">
            <Link to={`/governance/collection-page`} className="text-xl">
              <span className="absolute inset-0" />
              {props.title}
            </Link>
          </h3>
        </div>
      </div>
    </li>
  );
}
