import {
    FilterByStatus,
  } from "../data/marketplace.pb";

export type Filter =
  | {
      type: "status";
      status: FilterByStatus;
    }
  | { type: "trait"; key: string; value: string };