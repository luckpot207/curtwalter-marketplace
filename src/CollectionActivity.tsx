import React from "react";
import CollectionHeader from "./components/collectionHeader";

import { useParams } from "react-router-dom";
import { TradingHistory } from "./components/TradingHistory";

export default function CollectionActivity() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="bg-white flex flex-col">
      <CollectionHeader collectionID={slug!} />
      <div className="flex flex-1 sm:px-6 lg:px-8 items-center justify-center">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-6 max-w-7xl w-full overflow-hidden h-screen">
          <div className="mt-20">
            <TradingHistory
              resourceType="COLLECTION"
              id={slug!}
              title="Activity"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
