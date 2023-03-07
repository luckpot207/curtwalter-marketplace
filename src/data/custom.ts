import { TokenFullInfo, Token } from "./marketplace.pb";
import { Metadata } from "./metadata.pb";

export interface JToken extends Omit<Token, "metadata"> {
  metadata?: Metadata;
}

export interface TokenInfo extends Omit<TokenFullInfo, "token"> {
  token?: JToken;
}
