import { NavLink, useNavigate } from "react-router-dom";
import { Image } from "../image/Image";
// import {fetcher, lamportsToSOL, marketplaceServerUrl, nFormatter, tokenImage} from "../../lib/utils";
import { SolanaLogo } from "../logo/SolanaLogo";
import { Button } from "../../lib/flowbite-react";
import { useTheme } from "../../lib/next-themes";
// import {Listing} from "@piggydao/marketplace-models";

export function Hero() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  return (
    <section
      className="flex flex-col items-center rounded-3xl border shadow-md md:flex-row
       dark:border-zinc-700 dark:bg-zinc-800 bg-gray-100 border-gray-100 max-w-full w-full mb-8">

      <div className='relative hover:shadow-lg m-4 rounded-3xl md:max-w-[340px] xl:max-w-[256px]' style={{ minWidth: "256px" }}>
        <NavLink to={`/t/`} className='rounded-3xl'>
          <Image
            src={''}
            size='2xl'
            placeholder="blur"
            className='rounded-3xl'
          />
          <div className='absolute flex bg-white dark:bg-zinc-700 items-center justify-center text-lg w-full text-gray-600 dark:text-white bottom-[-2px] p-2 rounded-b-3xl'>
            Price:
            <SolanaLogo className='h-4 ml-1 mr-1 w-4' />
            {/* {nFormatter(lamportsToSOL(data?.price ?? 0), 2)} */}
          </div>
        </NavLink>
      </div>

      <div className="flex flex-col justify-between p-4 leading-normal">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-center md:text-left">Latest NFT Deal</h1>

        <NavLink to='/explore' className="mb-3 text-xl font-bold tracking-tight text-center md:text-left">
          {/* {data?.collection?.title} */}
        </NavLink>

        <p className="mb-3 font-normal text-justify md:text-left">
          {/* {data?.collection?.description} */}
        </p>

        <div className='flex justify-center md:justify-start'>
          <Button size="md"
            color='dark'
          // onClick={(e: { preventDefault: () => void; }) => {
          //   e.preventDefault()
          //   navigate(`/t/`)
          // }}
          >
            Buy NOW
          </Button>
        </div>

      </div>
    </section>
  )
}