"use client";

import { Typography } from "@/src/ui/typography";
import { PoolRemoteLogo } from "@/src/ui/pool-remote-logo";
import { useChainId } from "wagmi";
import { Skeleton } from "@/src/ui/skeleton";
import type { NamedCampaign } from "@/src/hooks/useCampaigns";

import styles from "./styles.module.css";

interface PoolProps {
    campaign: NamedCampaign;
}

export function Pool({ campaign }: PoolProps) {
    const chainId = useChainId();

    return (
        <div className={styles.root}>
            <PoolRemoteLogo
                chain={chainId}
                token0={{
                    address: campaign.pool.token0.address,
                    defaultText: campaign.pool.token0.symbol,
                }}
                token1={{
                    address: campaign.pool.token1.address,
                    defaultText: campaign.pool.token1.symbol,
                }}
            />
            <div className={styles.titleContainer}>
                <Typography
                    variant="sm"
                    weight="medium"
                    className={styles.campaignName}
                    noWrap
                >
                    {campaign.name}
                </Typography>
                <Typography
                    variant="xs"
                    weight="medium"
                    className={styles.campaignFee}
                    light
                >
                    {campaign.pool.fee}%
                </Typography>
            </div>
        </div>
    );
}

export function SkeletonPool() {
    return (
        <div className={styles.root}>
            <PoolRemoteLogo loading />
            <div className={styles.titleContainer}>
                <Skeleton variant="lg" width={200} />
                <Skeleton variant="sm" width={50} />
            </div>
        </div>
    );
}
