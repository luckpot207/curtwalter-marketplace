import React from "react";
import { Helmet } from "react-helmet";
import classNames from "classnames";
import {Layout} from "../componentsV3/layout/Layout";

const faq = [
  {
    question: "What is alpha art?",
    content: `
      <p>Alpha art is the revolutionary NFT marketplace currently allowing users to buy/sell Solana based NFTs without any listing fees.</p>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/7/c/7cf447caaa3d597a9d21eede4c1cd0872c469cbc/340.png",
  },
  {
    question: "How can I start buying/selling?",
    content: `
      <p>Simply connect with your wallet from the top right corner and click on your wallet name. You will be able to see all of your NFTs in the wallet which can be listed instantly on alpha art.</p>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/7/d/7d4063649b8c33ff077fc8b3031ca5afdc202b21/340.png",
  },
  {
    question: "What is the offer system on alpha art?",
    content: `
      <p>We are the first and only marketplace on Solana network where you can send an offer to any NFT on our marketplace whether if it’s listed or not.
      <br />
      <br />
      You can simply browse any NFT and give an offer via “Make Offer” button which will be valid until your chosen date. Please note that when you make an offer, respective amount of SOL will be deducted from your account to be used if the seller accepts it. 
      </p>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/0/2/0289e4a9c5641cd1da4fd9df0e2fa55db28270e8/340.png",
  },
  {
    question: "How do I cancel an offer?",
    content: `
      <p>
      You can see all of your given/received offers from the "My Wallet" section which can be accessible from the top right corner given you are connected. Simply go to “My Offers” section from the left menu and you can cancel any of your offers whenever you want. Respective amount of SOL will be deposited back to your wallet immediately. 
      </p>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/0/b/0b1e4a821d24e571d2f5265fb5fa149289aacb91/340.png",
  },
  {
    question: "How can I contact alpha art if there is an issue?",
    content: `
      <div>
      You can reach us for support on our <a class="text-black" href="https://discord.gg/HGvk9YDFBy" target="_blank" rel="noreferrer">discord server<a/> or via email <a class="text-black" href="mailto:support@alpha.art">support@alpha.art </a>.
<br />
      <strong>Please provide:</strong>
      <li>Your email address</li>
      <li>Your wallet address (if applicable)</li>
      <li>The NFT id/token address you are having an issue with (if applicable)</li>
      <li>Detailed information about the issue</li>
      </div>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/b/7/b7870ac06fb279514b897e024ba9e5ad3a48340b/340.png",
  },
  {
    question: "I'm collection owner, How can I update banner and description?",
    content: `
      <p>You can to update banner image, thumbnail, description from alpha.art website. Only token update authority will be able to update these fields.</p>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/3/6/36abf8ac4fa829d3767a28d4b205044628933106/340.png",
  },
  {
    question: "What are the fees?",
    content: `
      <p>Alpha art doesn’t charge any listing/unlisting/offer fees. We have 2% flat seller fee which is taken at the time of the sale.</p>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/2/7/277563d369fe41fe925acaaeba792e8dd6ea553c/340.png",
  },
  {
    question: "Can I mint NFTs on alpha art?",
    content: `
      <p>Alpha art doesn’t support minting at the moment.</p>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/3/6/36abf8ac4fa829d3767a28d4b205044628933106/340.png",
  },
  {
    question:
      "I'm collection creator, why my collection is unlisted from alpha.art",
    content: `
      <p>NFT collections with royalty sharing utilities in their roadmaps have been unlisted from Alpha.art. 
      Moving forward we will not be able to list any NFT collection with such mechanics.</p>
    `,
    avatarSrc:
      "https://assets.alpha.art/opt/4/3/43a3c987791a4b8649007d1fbb6ab5174ce9c649/340.png",
  },
];

export default function FAQ() {
  return (
    <Layout footer={false}>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h2 className="font-bold text-xl">Frequently Asked Questions</h2>
        <div className="pt-2">
          {faq.map((review, reviewIdx) => (
            <div
              key={reviewIdx}
              className="flex text-sm text-gray-500 space-x-4"
            >
              <div className="flex-none py-10">
                <img
                  src={review.avatarSrc}
                  alt=""
                  className="w-10 h-10 bg-gray-100 rounded-full object-cover"
                />
              </div>
              <div
                className={classNames(
                  reviewIdx === 0 ? "" : "border-t border-gray-200",
                  "flex-1 py-10"
                )}
              >
                <h3 className="font-medium text-gray-900">{review.question}</h3>
                <div
                  className="mt-4 prose prose-sm max-w-none text-gray-500"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}