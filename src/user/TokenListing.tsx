import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { OfferAndPubKey } from "../api/app/instructions";
import SimpleToken, { ItemShowField } from "../components/simpleToken";
import { CancelOfferDialog } from "../components/token/offerCancel";
import { Collection, TokenAPISimple } from "../data/marketplace.pb";
import { Image } from "../components/TradingHistory";
import Button from "../components/button";
import { Spinner } from "../components/spiners";

export function TokenListing(props: {
  collections?: Collection[];
  tokens: TokenAPISimple[];
  isLoading: boolean;
  title: string | ReactNode;
  emptyText: string;
  hideIfEmpty?: boolean;
  showField?: ItemShowField;
  showCancelOffer?: boolean;
  offers?: OfferAndPubKey[];
}) {
  const {
    title,
    isLoading,
    showCancelOffer,
    hideIfEmpty,
    tokens,
    collections,
    showField,
  } = props;
  const [cancelOffer, setCancelOffer] = React.useState<
    OfferAndPubKey | undefined
  >(undefined);

  const openCancelOffer = (token: TokenAPISimple) => {
    const offer = props.offers?.find(
      (o) => o.offer.mintId.toBase58() === token.mintId
    );
    setCancelOffer(offer);
  };

  if (tokens.length > 0) {
    if (collections) {
      return (
        <>
          <h2 className="text-2xl text-left mb-8">{title}</h2>
          {typeof cancelOffer !== "undefined" && (
            <CancelOfferDialog
              offer={cancelOffer.offer}
              nftPubKey={cancelOffer.offer.mintId.toBase58()}
              isOpen={typeof cancelOffer !== "undefined"}
              offerAccount={cancelOffer.pubkey}
              lamports={Number(cancelOffer.offer.price)}
              onClose={() => setCancelOffer(undefined)}
            />
          )}
          {collections.map((c) => (
            <>
              <Link to={"/collection/" + c.slug}>
                <div className="flex mt-12 items-center mb-4">
                  <div className="rounded-full overflow-hidden mr-4">
                    <Image src={c.thumbnail!} />
                  </div>
                  <h3 className="text-xl text-left">{c.title}</h3>
                </div>
              </Link>
              <div className="w-full border-b mb-4" />
              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {props.tokens
                  .filter((t) => t.collectionId === c.id)
                  .map((product) =>
                    showCancelOffer ? (
                      <div>
                        <SimpleToken
                          key={product.mintId}
                          {...product}
                          showField={showField}
                        />
                        <Button
                          title="Cancel Offer"
                          size="small"
                          className="py-1 px-1 mt-1"
                          onClick={() => {
                            openCancelOffer(product);
                          }}
                        />
                      </div>
                    ) : (
                      <SimpleToken
                        key={product.mintId}
                        {...product}
                        showField={showField}
                      />
                    )
                  )}
              </div>
            </>
          ))}
        </>
      );
    }
    return (
      <>
        <h2 className="text-2xl text-left mb-8">{title}</h2>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {props.tokens.map((product) => (
            <SimpleToken
              key={product.mintId}
              {...product}
              showField={showField}
            />
          ))}
        </div>
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        <h2 className="text-2xl text-left mb-8">{title}</h2>
        <div className="w-full flex items-center justify-center">
          <Spinner size={96} />
        </div>
      </>
    );
  }
  if (hideIfEmpty === true) {
    return null;
  }
  return (
    <>
      <h2 className="text-2xl text-left mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <p className="text-base text-left mb-4 mt-4">{props.emptyText}</p>
      </div>
    </>
  );
}
