import { CollectionMeta } from "../data/marketplace.pb";
// import { useDispatch, useSelector } from "../api/store";
// import { getCollectionMetaThrottled } from "../api/api";
import { useEffect } from "react";

export default function useCollection(
  slugOrId: string
): any {
  // const collectionMeta = useSelector<CollectionMeta | undefined>(
  //   (data: { collectionMetas: { [x: string]: any; }; }) => data.collectionMetas[slugOrId]
  // );
  // const collectionMetaStatus = useSelector(
  //   (data: { collectionMetasStatus: { [x: string]: any; }; }) => data.collectionMetasStatus[slugOrId]
  // );
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!collectionMetaStatus && slugOrId) {
  //     dispatch({ type: "ResetTokenList" });
  //     getCollectionMetaThrottled(slugOrId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [collectionMetaStatus, slugOrId]);

  // return [collectionMeta, !collectionMetaStatus];
}
