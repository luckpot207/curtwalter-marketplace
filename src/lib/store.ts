import { useLayoutEffect } from 'react'
import create, { StoreApi } from 'zustand'
import createContext from 'zustand/context'
// import { UserPublic, WalletBalance } from "@piggydao/marketplace-models";

export interface ZustandState {
  // HEADER
  headerSearchOnMobileShow: boolean
  headerSearchFocus: boolean
  headerBackDropShow: boolean
  headerWalletMenuShow: boolean
  headerMobileMenuShow: boolean

  setHeaderSearchOnMobileShow: (value: boolean) => void
  setHeaderSearchFocus: (value: boolean) => void
  setHeaderBackDropShow: (value: boolean) => void
  setHeaderWalletMenuShow: (value: boolean) => void
  setHeaderMobileMenuShow: (value: boolean) => void


  // WALLET
  walletBalance: number | null
  walletUserPublic: any | null

  setWalletBalance: (value: number) => void
  setWalletUserPublic: (value: any) => void

  // COLLECTIONS TRENDING GRID
  collectionTrendingGridIntervalDropdownOpen: boolean

  setCollectionTrendingGridIntervalDropdownOpen: (value: boolean) => void

}

let store: any

// @ts-ignore
const initialState: ZustandState = {
  headerSearchOnMobileShow: false,
  headerSearchFocus: false,
  headerBackDropShow: false,
  headerWalletMenuShow: false,
  headerMobileMenuShow: false,

  walletBalance: null,
  walletUserPublic: null,

  collectionTrendingGridIntervalDropdownOpen: false
}

const zustandContext = createContext<StoreApi<ZustandState>>()
export const Provider = zustandContext.Provider
export const useStore: () => ZustandState = zustandContext.useStore

export const initializeStore = (preloadedState = {}) => {
  return create<ZustandState>((set: any) => ({
    ...initialState,
    ...preloadedState,

    // HEADER
    setHeaderSearchOnMobileShow: (value: boolean) => {
      set({ headerSearchOnMobileShow: value })
    },
    setHeaderSearchFocus: (value: boolean) => {
      set({ headerSearchFocus: value })
    },
    setHeaderBackDropShow: (value: boolean) => {
      set({ headerBackDropShow: value })
    },
    setHeaderWalletMenuShow: (value: boolean) => {
      set({ headerWalletMenuShow: value })
    },
    setHeaderMobileMenuShow: (value: boolean) => {
      set({ headerMobileMenuShow: value })
    },

    // WALLET
    setWalletBalance: (value: number) => {
      set({ walletBalance: value })
    },
    setWalletUserPublic: (value: any) => {
      set({ walletUserPublic: value })
    },

    // COLLECTIONS TRENDING GRID
    setCollectionTrendingGridIntervalDropdownOpen: (value: boolean) => {
      set({ collectionTrendingGridIntervalDropdownOpen: value })
    },
  }))
}

export function useCreateStore(initialState: ZustandState) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeStore(initialState)
  }

  // For CSR, always re-use same store.
  store = store ?? initializeStore(initialState)
  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState,
      })
    }
  }, [initialState])

  return () => store
}