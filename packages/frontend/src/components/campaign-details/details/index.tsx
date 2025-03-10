import { useTranslations } from "next-intl";
import styles from "./styles.module.css";
import { TextField } from "@/src/ui/text-field";
import type { NamedCampaign } from "@/src/hooks/useCampaign";
import dayjs from "dayjs";
import { Status } from "@metrom-xyz/sdk";
import { Typography } from "@/src/ui/typography";
import { useMemo } from "react";
import { formatUsdAmount } from "@/src/utils/format";

interface DetailsProps {
    campaign?: NamedCampaign;
    loading: boolean;
}

export function Details({ campaign, loading }: DetailsProps) {
    const t = useTranslations("campaignDetails.details");

    const detailsLoading = loading || !campaign;
    const duration = useMemo(() => {
        if (!campaign) return undefined;

        if (campaign.status === Status.Upcoming) {
            return {
                text: t("status.upcoming.text"),
                duration: t("status.upcoming.duration", {
                    days: dayjs.unix(campaign.from).to(dayjs(), true),
                }),
            };
        }
        if (campaign.status === Status.Ended) {
            return {
                text: t("status.ended.text"),
                duration: t("status.ended.duration", {
                    days: dayjs().to(dayjs.unix(campaign.to), true),
                }),
            };
        }

        return {
            text: t("status.live.text"),
            duration: t("status.live.duration", {
                days: dayjs().to(dayjs.unix(campaign.to), true),
            }),
        };
    }, [campaign, t]);

    return (
        <div className={styles.root}>
            <div>
                <TextField
                    boxed
                    variant="xl"
                    label={t("tvl")}
                    loading={detailsLoading}
                    value={formatUsdAmount(campaign?.pool.tvl)}
                />
                <TextField
                    boxed
                    variant="xl"
                    label={t("status.text")}
                    loading={detailsLoading}
                    value={
                        <div className={styles.statusWrapper}>
                            <div className={styles.statusDot}>
                                <div
                                    className={
                                        campaign && styles[campaign.status]
                                    }
                                ></div>
                            </div>
                            <Typography weight="medium" variant="xl">
                                {duration?.text}
                            </Typography>
                        </div>
                    }
                />
            </div>
            <div>
                <TextField
                    boxed
                    variant="xl"
                    uppercase
                    label={t("startDate")}
                    loading={detailsLoading}
                    value={
                        campaign &&
                        dayjs.unix(campaign.from).format("DD/MMM/YY HH:mm")
                    }
                />
                <TextField
                    boxed
                    variant="xl"
                    uppercase
                    label={t("endDate")}
                    loading={detailsLoading}
                    value={
                        campaign &&
                        dayjs.unix(campaign.to).format("DD/MMM/YY HH:mm")
                    }
                />
                <TextField
                    boxed
                    variant="xl"
                    label={duration?.text || t("status.duration")}
                    loading={detailsLoading}
                    value={duration?.duration || "-"}
                />
            </div>
        </div>
    );
}
