// import {useSelector} from "../../api/store";
import useCountDown from "../../utils/countdown";
import React from "react";
import { UpcomingCollectionData } from "../../data/collection";
import { Link } from "react-router-dom";
// import {nFormatter} from "../collectionHeader";
import { lamportsToSOL } from "../../utils/sol";

export function UpcomingCollection(props: {
  collection: UpcomingCollectionData;
}) {
  const { collection } = props;

  let twitterLink = collection.twitter;
  if (!twitterLink) {
    twitterLink = collection.otherLinks?.filter((a) =>
      a.startsWith("https://twitter.com")
    )[0];
  }

  let discordLink = collection.discordInvite;
  if (!discordLink) {
    discordLink = collection.otherLinks?.filter((a) =>
      a.startsWith("https://discord.gg")
    )[0];
  }

  const darkMode = false; // useSelector((data) => data.darkMode);

  const nftMintTime = new Date(collection.mintTime as any);
  const timeLeft: any = useCountDown(nftMintTime);

  return (
    <li
      key={collection.id}
      className={`w-full inline-flex flex-col text-center bg-silver dark:bg-darkgray rounded-3xl p-4 ${
        darkMode ? "purple-border-hover" : "gray-border-hover"
      }`}
    >
      <div className="group relative h-full flex flex-col justify-between">
        <div className="w-full bg-gray-200 rounded-2xl overflow-hidden aspect-w-1 aspect-h-1">
          <img
            src={collection.featuredImage}
            alt=""
            loading="lazy"
            className="w-full h-full object-center object-cover group-hover:opacity-75"
          />
        </div>
        <div className="mt-2">
          <h3 className="mt-2 font-semibold text-gray-900 lines-1 mb-2">
            {twitterLink ? (
              <a href={twitterLink} target="_blank">
                <span className="absolute inset-0 " />
                {collection.name}
              </a>
            ) : (
              collection.name
            )}
          </h3>
          <div className="bg-white items-number-box-shadow text-sm w-full font-semibold text-gray-700 rounded-2xl py-2 flex justify-between px-3">
            <p className="">
              <span className="text-velvet">Mint: </span>
              {nftMintTime.getTime() > new Date().getTime()
                ? `${timeLeft.days}D ${timeLeft.hours}H ${timeLeft.minutes}M ${timeLeft.seconds}s`
                : nftMintTime.toLocaleDateString("en-US")}
            </p>
            <p className="flex">
              {twitterLink ? (
                <a className="ml-1" href={twitterLink} target="_blank">
                  <img
                    loading="eager"
                    className="invert-icon social-icon"
                    width={16}
                    height={16}
                    alt="TwitterIcon"
                    src={`/icons/Twitter-original.svg`}
                  />
                </a>
              ) : null}

              {/*{(discordLink ? (
                                <a className="ml-1" href={discordLink} target="_blank">
                                    <img
                                        loading="eager"
                                        className="invert-icon social-icon"
                                        width={16}
                                        height={16}
                                        alt="DiscordIcon"
                                        src={`/icons/globe-alt.svg`}
                                    />
                                </a>
                            ) : null)}*/}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
