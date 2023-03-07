import { Layout } from "../componentsV3/layout/Layout";
import React from "react";
import { Hero } from "../componentsV3/hero/Hero";
import { Trending24hCollectionsCarousel } from "../componentsV3/collections/Trending24hCollectionsCarousel";
import { NewCollectionsCarousel } from "../componentsV3/collections/NewCollectionsCarousel";
import { UpcomingCollectionsCarousel } from "../componentsV3/collections/UpcomingCollectionsCarousel";
import { CategoriesGrid } from "../componentsV3/categories/CategoriesGrid";
import { StakeToEarnBanner } from "../componentsV3/staking/StakeToEarnBanner";
import { TrendingGrid } from "../componentsV3/collections/TrendingGrid";

export function Index() {
  return (
    <Layout footer={true}>
      <div className="container py-8 px-4">
        <Hero />
        {/* <Trending24hCollectionsCarousel/>
        <NewCollectionsCarousel/>
        <UpcomingCollectionsCarousel/>
        <CategoriesGrid/>
        <StakeToEarnBanner/>
        <TrendingGrid/> */}
      </div>
    </Layout>
  );
}
