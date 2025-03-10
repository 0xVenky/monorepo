import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useAmmsInChain } from "@/src/hooks/useAmmsInChain";
import classNames from "@/src/utils/classes";
import { Typography } from "@/src/ui/typography";
import type {
    AmmInfo,
    CampaignPayload,
    CampaignPayloadPart,
} from "@/src/types";

import styles from "./styles.module.css";

interface AmmStepProps {
    disabled?: boolean;
    amm?: CampaignPayload["amm"];
    onAmmChange: (amm: CampaignPayloadPart) => void;
}

export function AmmStep({ disabled, amm, onAmmChange }: AmmStepProps) {
    const t = useTranslations("newCampaign.form.amm");
    const [open, setOpen] = useState(true);

    const chainId = useChainId();
    const availableAmms = useAmmsInChain(chainId);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (amm || availableAmms.length > 1) return;
        onAmmChange({ amm: availableAmms[0] });
        setOpen(false);
    }, [amm, availableAmms, onAmmChange]);

    const getAmmChangeHandler = useCallback(
        (newAmm: AmmInfo) => {
            return () => {
                if (amm && amm.slug === newAmm.slug) return;
                onAmmChange({ amm: newAmm });
                setOpen(false);
            };
        },
        [amm, onAmmChange],
    );

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!amm}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {amm && (
                    <div className={styles.ammPreview}>
                        <div className={styles.logo}>
                            <amm.logo />
                        </div>
                        <Typography variant="lg" weight="medium">
                            {amm.name}
                        </Typography>
                    </div>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.ammWrapper}>
                    {availableAmms.map((availableAmm) => (
                        <div
                            key={availableAmm.slug}
                            className={classNames(styles.ammRow, {
                                [styles.ammRowSelected]:
                                    amm?.slug === availableAmm.slug,
                            })}
                            onClick={getAmmChangeHandler(availableAmm)}
                        >
                            <div className={styles.logo}>
                                <availableAmm.logo />
                            </div>
                            <Typography variant="lg" weight="medium">
                                {availableAmm.name}
                            </Typography>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}
