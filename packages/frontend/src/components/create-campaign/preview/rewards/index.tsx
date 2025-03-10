import type { CampaignPayload } from "@/src/types";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { TextField } from "@/src/ui/text-field";
import { Typography } from "@/src/ui/typography";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import dayjs from "dayjs";
import { useMemo } from "react";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface RewardsProps {
    rewards: CampaignPayload["rewards"];
    campaignDurationSeconds: number;
}

export function Rewards({ rewards, campaignDurationSeconds }: RewardsProps) {
    const t = useTranslations("campaignPreview.rewards");
    const chain: SupportedChain = useChainId();

    const totalRewardsUsdAmount = useMemo(() => {
        if (!rewards) return 0;
        return rewards.reduce((accumulator, reward) => {
            if (!reward.usdPrice) return 0;
            return (accumulator += reward.amount * reward.usdPrice);
        }, 0);
    }, [rewards]);

    const dailyRewards = useMemo(() => {
        if (!totalRewardsUsdAmount) return 0;

        const daysDuration = dayjs
            .duration(campaignDurationSeconds, "seconds")
            .get("days");

        return daysDuration > 0 ? totalRewardsUsdAmount / daysDuration : 0;
    }, [campaignDurationSeconds, totalRewardsUsdAmount]);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("token")}
                </Typography>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("amount")}
                </Typography>
            </div>
            {rewards?.map((reward) => (
                <div key={reward.token.address} className={styles.row}>
                    <div className={styles.nameContainer}>
                        <RemoteLogo
                            chain={chain}
                            address={reward.token.address}
                        />
                        <Typography uppercase weight="medium" variant="lg">
                            {reward.token.symbol}
                        </Typography>
                    </div>
                    <Typography uppercase weight="medium" light>
                        {formatUsdAmount(
                            reward.usdPrice
                                ? reward.amount * reward.usdPrice
                                : 0,
                        )}
                    </Typography>
                    <Typography uppercase weight="medium" variant="lg">
                        {formatTokenAmount(reward.amount)}
                    </Typography>
                </div>
            ))}
            <div className={styles.summary}>
                <TextField
                    boxed
                    label={t("daily")}
                    value={formatUsdAmount(dailyRewards)}
                    className={styles.summaryBox}
                />
                <TextField
                    boxed
                    label={t("total")}
                    value={formatUsdAmount(totalRewardsUsdAmount)}
                    className={styles.summaryBox}
                />
            </div>
        </div>
    );
}
