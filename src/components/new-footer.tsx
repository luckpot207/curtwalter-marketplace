import React from "react";
import { Link } from "react-router-dom";
import { useWindowSize } from "../utils/useWindowSize";

export default function NewFooter() {
  const windowSize = useWindowSize();

  const SocialFooter = () => {
    // Update links
    const socialIcons = [
      { link: "https://discord.gg/HGvk9YDF", img: "Discord - Original.svg" },
      //{ link: "", img: "Instagram - Original.svg" },
      //{ link: "", img: "Reddit - Original.svg" },
      //{ link: "", img: "Telegram - Original.svg" },
      { link: "https://twitter.com/AlphaArtMarket", img: "Twitter-original.svg" },
      //{ link: "", img: "YouTube-original.svg" },
    ];
    return (
      <div className="text-center lg:text-left w-full mt-12 lg:mt-0">
        <p className="text-base">Join the community</p>

        <span className="mt-3 mb-8 flex w-full justify-center lg:justify-start gap-6 ">
          {socialIcons.map((icon, k) => (
            <a href={icon.link} key={k} className="social-icon" target='_blank'>
              <img
                loading="eager"
                className="invert-icon w-full h-full"
                width={28}
                alt={icon.img}
                src={`/icons/${icon.img}`}
              />
            </a>
          ))}
        </span>
        <p className="text-base text-black">
          &copy; 2022 AlphaArt All rights reserved
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 lg:px-0">
      <section
        id="trending-collectors"
        aria-labelledby="collections-heading"
        className="bg-velvet text-white rounded-2xl container mx-auto mb-5"
      >
        <div className="px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center py-5 dark:text-white">
          <div className="flex flex-col md:pl-8 w-full sm:pr-3 lg:pr-0">
            <h2 className="text-2xl">Stay in the loop</h2>
            <h4 className="text-sm lines-3 lg:lines-2 mt-1 lg:mt-0">
              Join our mailing list to stay in the loop with our newest feature
              releases, NFT drops, and tips and tricks for navigating AlphaArt.
            </h4>
          </div>
          <div className="w-full md:w-1/2 flex flex-col lg:flex-row mt-8 lg:mt-0 justify-end">
            {/*
            <input
              className="w-full py-2 lg:py-4 px-6 bg-velvet border border-white dark:border-white border-solid rounded-lg mr-4 lg:mx-8 placeholder-white dark:bg-velvet text-white "
              placeholder="Your email address"
            />
            */}
            <a href={'https://blog.alpha.art'}
               target='_blank'
               className="flex justify-center items-center py-3 px-8 text-white w-full lg:w-40 bg-black dark:bg-black dark:text-white rounded-lg mt-4 lg:mt-0">
              Join Blog
            </a>
          </div>
        </div>
      </section>
      <footer
        aria-labelledby="footer-heading "
        className="bg-white dark:bg-darkgray card-drop-small-shadow mt-4 mb-8 rounded-2xl container mx-auto"
      >
        {/* SUBSCRIBE to mail */}
        <div className="px-4 sm:px-6 lg:px-8 lg:pl-16 mt-5">
          <div className="py-4 lg:py-10 lg:flex flex-col lg:flex-row lg:items-center md:justify-between items-end">
            <div className="flex flex-col sm:flex-row lg:w-full lg:justify-between">
              <div className="md:text-left w-full lg:w-1/2 flex flex-col justify-center items-start">
                <img
                  id="alphaLogo"
                  className="h-9 w-auto mb-6"
                  src="/icon-root.svg"
                  alt=""
                />
                <p className="mb-5 text-xl">
                  Create, sell, or collect digital items secured with blockchain
                </p>
                {windowSize.width && windowSize.width > 1024 && (
                  <SocialFooter />
                )}
              </div>

              <div className="mt-4 flex items-end justify-center md:mt-0 w-full lg:w-1/2">
                <div className="flex space-x-8">
                  <div className="flex flex-col gap-2 text-lg">
                    <h3 className="font-bold mb-2 ">Marketplace</h3>
                    <Link to="/explore">Explore</Link>
                    <Link to="/submissions">Creators</Link>
                    <a href="https://blog.alpha.art" target='_blank'>Blog</a>
                  </div>
                  <div className="flex flex-col gap-2 text-lg">
                    <h3 className="font-bold mb-2">DAO</h3>
                    <Link to="/privacy">Privacy policy</Link>
                    <Link to="/faq">FAQ</Link>
                  </div>
                </div>
              </div>
            </div>

            {windowSize.width && windowSize.width < 1025 && <SocialFooter />}
          </div>
        </div>
      </footer>
    </div>
  );
}
