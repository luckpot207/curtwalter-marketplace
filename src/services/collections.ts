// import {
//   CollectionCategory,
//   CollectionExplore,
//   CollectionTrending,
//   CollectionTrendingInterval,
//   ListingApp
// } from "@piggydao/marketplace-models";

export async function fetchTrendingCollections(interval: string): Promise<any[]> {
  return (await fetch(`/api/collections/trending/${interval}`)).json();
}

export async function fetchNewCollections(): Promise<string[]> {
  return (await fetch(`/api/collections/new`)).json();
}

export async function fetchUpcomingCollections(): Promise<string[]> {
  return (await fetch(`/api/collections/upcoming`)).json();
}

export async function fetchCollectionCategories(): Promise<string[]> {
  return (await fetch(`/api/collections/categories`)).json();
}