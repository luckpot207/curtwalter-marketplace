import {Footer as FlowFooter} from "../../lib/flowbite-react"
import {BsDiscord, BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter} from "react-icons/bs";
import {AlphaArtLogo} from "../logo/AlphaArtLogo";
// import classNames from "classnames";
import {NavLink} from "react-router-dom";


export function Footer() {
  return (
    <FlowFooter className="flex flex-col mt-8">
      <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
        <div>
          <AlphaArtLogo className='h-9 mb-9 w-auto'/>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">
              About
            </h2>
            <FlowFooter.LinkGroup className="flex-col">
              <li className="mr-4 last:mr-0 md:mr-6 mb-4">
                <NavLink to='/explore' className='hover:text-black dark:hover:text-white'>
                  Explore
                </NavLink>
              </li>
              <li className="mr-4 last:mr-0 md:mr-6 mb-4">
                <NavLink to='/submissions' className='hover:text-black dark:hover:text-white'>
                  Creators
                </NavLink>
              </li>
              <li className="mr-4 last:mr-0 md:mr-6 mb-4">
                <a href='/privacy' target='_blank' className='hover:text-black dark:hover:text-white'>
                  Blog
                </a>
              </li>
            </FlowFooter.LinkGroup>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">
              Follow us
            </h2>
            <FlowFooter.LinkGroup className="flex-col">
              <FlowFooter.Link
                className="mb-4"
                href="https://discord.gg/HGvk9YDF"
              >
                Discord
              </FlowFooter.Link>
              <FlowFooter.Link
                className="mb-4"
                href="https://twitter.com/AlphaArtMarket"
              >
                Twitter
              </FlowFooter.Link>
            </FlowFooter.LinkGroup>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
              Legal
            </h2>
            <FlowFooter.LinkGroup className="flex-col">
              <li className="mr-4 last:mr-0 md:mr-6 mb-4">
                <NavLink to='/privacy' className='hover:text-black dark:hover:text-white'>
                  Privacy Policy
                </NavLink>
              </li>
            </FlowFooter.LinkGroup>
          </div>
        </div>
      </div>
      <hr className="my-6 w-full border-gray-200 p-1 dark:border-zinc-700 sm:mx-auto lg:my-8" />
      <div className="w-full sm:flex sm:items-center sm:justify-between">
        <FlowFooter.Copyright
          href="/"
          by="alpha.art"
          year={2022}
        />
        <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
          <FlowFooter.Icon
            href="https://discord.gg/HGvk9YDF"
            icon={BsDiscord}
          />
          <FlowFooter.Icon
            href="https://twitter.com/AlphaArtMarket"
            icon={BsTwitter}
          />
        </div>
      </div>
    </FlowFooter>
  )
}