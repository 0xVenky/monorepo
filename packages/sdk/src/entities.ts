import { type Address } from "viem";
import type { SupportedAmm } from "./commons";

export interface Token {
    address: Address;
    decimals: number;
    symbol: string;
    name: string;
}

export interface TokenAmount {
    token: Token;
    amount: bigint;
}

export interface UsdPricedToken extends Token {
    priceUsd: number | null;
}

export interface UsdPricedTokenAmount extends UsdPricedToken {
    valueUsd: number | null;
}

export interface Pool {
    address: Address;
    amm: SupportedAmm;
    fee: number;
    token0: Token;
    token1: Token;
    tvl: number;
}

export interface Rewards extends Array<UsdPricedTokenAmount> {
    valueUsd: number | null;
}

export interface Campaign {
    id: Address;
    createdAt: number;
    snapshottedAt: number | null;
    from: number;
    to: number;
    pool: Pool;
    whitelist: Address[] | null;
    blacklist: Address[] | null;
    rewards: Rewards;
    apr: number | null;
};

export interface Claim extends TokenAmount {
    campaignId: Address;
    token: Token;
    amount: bigint;
    proof: Address[];
}

export interface WhitelistedErc20Token extends Token {
    minimumRate: bigint;
}
