export type BaseCollectionData = {
    id: string,
    slug: string,
    title: string,
    thumbnail: string,
    totalItems: number,
    addedAt: string,
    listedCount?: number,
    floorPrice?: string
}

export type NewCollectionData = BaseCollectionData

export type TrendingCollectionData = BaseCollectionData & {
    trendingVolume: string
}

export type UpcomingCollectionData = {
    id: string
    featuredImage?: string
    name?: string
    description?: string
    minted?: string
    pfp?: string
    mintTime?: string
    twitter?: string
    discordInvite?: string
    otherLinks?: string[]
}

export type CategoryData = {
    id: string,
    name: string,
    volume: string,
    thumbnail: string
}
