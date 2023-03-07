import { useSelector } from "../api/store";
import { fetchUser } from "../api/api";
import React from "react";
import { User } from "../data/marketplace.pb";

export default function AccountName(props: { pubkey: string; user?: User }) {
  const { user } = useSelector((data) => ({ user: data.users[props.pubkey] }));

  React.useEffect(() => {
    if (!user && props.pubkey) {
      if (props.pubkey === props.user?.pubkey) {
      } else {
        fetchUser(props.pubkey);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pubkey]);
  if (props.user && props.user?.pubkey === props.pubkey) {
    return <span>{props.user.username}</span>;
  }
  if (user && user.username) {
    return <span>{user.username}</span>;
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
