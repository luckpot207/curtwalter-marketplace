// import { useSelector } from "../api/store";
// import { fetchUser } from "../api/api";
import React from "react";
import { User } from "../data/marketplace.pb";

export default function AccountName(props: { pubkey: string; user?: User }) {
  // const { user } = useSelector((data) => ({ user: data.users[props.pubkey] }));
  const test_user = {
    pubkey: "0xEe7bEa1aCA01D0b2EB3F30C2785A2d7025DbdD6b",
    username: "john",
    email: "luckhole19971119@gmail.com",
    createdAt: "1678393314524",
    annotations: {
      name: "Alice",
      age: "30",
      email: "alice@example.com",
    },
    isAdmin: false,
    minimumOffer: 100,
    minimumCollectionOffers: {
      low: 3,
      medium: 4,
      high: 6,
    },
    notifications: {
      disableItemsSold: true,
      disableOfferAccepted: true,
      disableNewOffers: true,
      disableFeaturedCollections: true,
      disableNewCollection: true,
    },
  };

  React.useEffect(() => {
    if (!test_user && props.pubkey) {
      if (props.pubkey === props.user?.pubkey) {
      } else {
        // fetchUser(props.pubkey);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pubkey]);
  if (props.user && props.user?.pubkey === props.pubkey) {
    return <span>{props.user.username}</span>;
  }
  if (test_user && test_user.username) {
    return <span>{test_user.username}</span>;
  }
  if (props.pubkey) {
    const small =
      props.pubkey.substring(0, 4) +
      "..." +
      props.pubkey.substring(props.pubkey.length - 4);
    return <span>{small}</span>;
  } else {
    return <span></span>;
  }
}
