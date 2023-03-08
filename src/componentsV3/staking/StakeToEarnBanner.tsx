import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {Button} from "../../lib/flowbite-react";
import {useTheme} from "../../lib/next-themes";
import MoonkeesNft from "../../assets/nfts/moonkes.png";

export function StakeToEarnBanner() {
  const { theme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="relative pt-9 overflow-hidden container mx-auto">
      <div className="">
        <div className="px-4 lg:px-0 ">
          <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-zinc-800 justify-between card-drop-small-shadow rounded-3xl">
            <div
              className="rounded-bl-3xl w-1/4  "
              style={{
                backgroundImage: `url("./img/fee-reduction-piggy-left.png")`,
                backgroundPosition: "left bottom" /*Positioning*/,
                backgroundSize: "contain",
                filter: "grayscale(50%)",
                backgroundRepeat:
                  "no-repeat" /*Prevent showing multiple background images*/,
              }}
            />

            <div className="relative py-6 md:py-16 sm:py-16 px-4 lg:px-0 flex flex-col items-center md:items-start">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Stake to Earn
              </h1>
              <p className="mt-6 mb-6 text-xl max-w-3xl text-center md:text-left">
                Earn Solana on alpha.art by owning and staking Piggy Sol
                Gang NFTs. Payments will be distributed equally among staked
                Pigs.
              </p>
              <div className="flex justify-center flex-col md:flex-row md:justify-start items-center">
                <div className='mt-4 md:mr-2 inline-block'>
                  <Button size="md"
                          color='dark'
                          onClick={(e) => {
                            e.preventDefault()
                            navigate(`/collection/piggy-sol-gang`)
                          }}>
                    Get Your Piggy
                  </Button>
                </div>
                <div className='mt-4 md:ml-2 inline-block'>
                  <Button size="md"
                          color='dark'
                          onClick={(e) => {
                            e.preventDefault()
                            navigate(`/stake`)
                          }}>
                    Stake Your Piggy
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="rounded-br-3xl w-1/4"
              style={{
                backgroundImage: `url("./img/fee-reduction-right.png")`,
                backgroundPosition: "right bottom" /*Positioning*/,
                backgroundSize: "cover",
                filter: "grayscale(50%)",
                backgroundRepeat:
                  "no-repeat" /*Prevent showing multiple background images*/,
              }}
            />
            <div className="hidden absolute inset-0 bg-white opacity-75" />
          </div>
        </div>
      </div>
    </div>
  )
}