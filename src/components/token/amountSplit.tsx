import React from "react";
import { getStakeAccount } from "../../api/app/utils";
import { useSelector } from "../../api/store";

export function AccountInfoRow(props: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <dt className="font-medium">{props.title}</dt>
      <dd className="prose prose-sm max-w-none">
        <p>{props.value}</p>
      </dd>
    </div>
  );
}

function useWalletDiscountInfo(ignore: boolean) {
  const [tokens, setTokens] = React.useState<string[]>([]);
  const { wallet, connection } = useSelector((data) => ({
    wallet: data.wallet,
    connection: data.connection,
  }));
  React.useEffect(() => {
    if (wallet && wallet.publicKey && !ignore) {
      const pk = wallet.publicKey;
      getStakeAccount(connection, pk)
        .then((res) => {
          setTokens(res.tokens.map((t) => t.mint.toBase58()));
        })
        .catch((err) => { });
    }
  }, []);
  return tokens;
}
const DefaultMarketFee = 0.005;
// const MIN_TIMESTAMP = 1637528400;
// const SECONDS_PER_WEEK = 604800;

export function AmountSplit(props: {
  price: number;
  royalty: number;
  offer?: boolean;
  symbol?: string;
  authority?: string;
  tokenPublicKey: string;
  showDiscountNotice?: boolean;
}) {
  const { price } = props;
  const [royalty, setRoyalty] = React.useState(props.royalty);
  const marketFee = DefaultMarketFee

  //let [marketFee, setMarketFee] = React.useState(DefaultMarketFee);
  //let [discounted, setDiscounted] = React.useState(false);
  //const tokens = useWalletDiscountInfo(props.offer === true);
  /*
  React.useEffect(() => {
    if (tokens.length > 0) {
      const perPig = DefaultMarketFee / 4;
      const l = Math.min(tokens.length, 4);
      setMarketFee(DefaultMarketFee - perPig * l);
      setDiscounted(true);
    } else {
      setMarketFee(DefaultMarketFee);
      setDiscounted(false);
    }
  }, [tokens]);
   */

  React.useEffect(() => {
    setRoyalty(props.royalty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.price, props.royalty]);

  return (
    <div>
      <AccountInfoRow
        title={`Royalty (${Math.round(royalty * 1000) / 10}%):`}
        value={`${Math.round(price * royalty * 100) / 100} SOL`}
      />
      <AccountInfoRow
        title={`Service Fee (${marketFee * 100}%):`}
        value={`${Math.round(price * marketFee * 100) / 100} SOL`}
      />
      {/*<AccountInfoRow
        title={`Service Fee (${marketFee * 100}%${discounted ? "*" : ""}):`}
        value={`${Math.round(price * marketFee * 100) / 100} SOL`}
      />*/}
      {/*{props.showDiscountNotice && !discounted && (
        <div>
          <p className="text-gray-500 text-sm mt-2">
            Reduce Service Fee by Owning{" "}
            <Link to="/collection/piggy-sol-gang" className="underline">
              Piggy Sol Gang
            </Link>
          </p>
        </div>
      )}*/}
      <AccountInfoRow
        title={props.offer ? "NFT Owner will get:" : "Your earning:"}
        value={`${Math.round((price - price * (royalty + marketFee)) * 100) / 100
          } SOL`}
      />
      {/*{discounted && (
        <p className="text-gray-500 text-sm mt-2">
          * Discount will be calculated during NFT sale
        </p>
      )}*/}
    </div>
  );
}
