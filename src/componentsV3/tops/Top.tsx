import { NavLink, useNavigate } from "react-router-dom";
import { Image } from "../image/Image";
// import {fetcher, lamportsToSOL, marketplaceServerUrl, nFormatter, tokenImage} from "../../lib/utils";
import { SolanaLogo } from "../logo/SolanaLogo";
import { Button } from "../../lib/flowbite-react";
import { useTheme } from "../../themes";
import SpaceLauncher from "../../assets/nfts/5852.jpg";
import MoonkeesNft from "../../assets/nfts/moonkes.png";
import { ImageTransformation } from "@cloudinary/url-gen";
// import {Listing} from "@piggydao/marketplace-models";

export function Top() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <section
      className="flex flex-col items-center rounded-3xl border shadow-md md:flex-row
       dark:border-zinc-700 dark:bg-zinc-800 bg-gray-100 border-gray-100 w-full mb-8 dark:text-white"
    >
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-center md:text-left">
          Latest NFT Deal
        </h1>

        <div
          // to="/explore"
          className="mb-3 text-xl font-bold tracking-tight text-center md:text-left dark:text-white"
        >
          {/* {data?.collection?.title} */}
          {"Piggy Sol Gang"}
        </div>
        <p className="mb-3 font-normal text-justify text-[18px] md:text-left dark:text-gray-300">
          {/* {data?.collection?.description} */}
          {
            "10,000 cute & cruel piggies living on the Solana lands. Each of them are randomly generated with more than 90+ hand-drawn traits"
          }
        </p>
        <div className="flex justify-center md:justify-start">
          <Button
            size="md"
            color="dark"
            onClick={(e: { preventDefault: () => void; }) => {
              e.preventDefault()
              navigate(`/t`)
            }}
          >
            Go to Launchpad
          </Button>
        </div>

      </div>
      <div
        className="relative hover:shadow-lg m-4 rounded-3xl w-[100vh] h-[80vh] lg:flex lg:justify-center"
        style={{ minWidth: "256px" }}
      >
        <div className="rounded-3xl">
          <Image
            src={MoonkeesNft}
            size="3xl"
            placeholder="blur"
            className="h-[80vh] w-[100vh] rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}
