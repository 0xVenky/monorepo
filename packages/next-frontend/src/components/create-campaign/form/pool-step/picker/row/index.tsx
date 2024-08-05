import type { Pool } from "@metrom-xyz/sdk";
import numeral from "numeral";
import { Typography } from "@/src/ui/typography";
import classNames from "@/src/utils/classes";
import { PoolRemoteLogo } from "@/src/ui/pool-remote-logo";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";

interface PickerRowProps {
    pool: Pool;
    style?: any;
    loading?: boolean;
    active?: boolean;
    onClick: (pool: Pool) => void;
}

export function Row({ style, pool, active, loading, onClick }: PickerRowProps) {
    function handlePoolOnClick() {
        onClick(pool);
    }

    return (
        <div
            style={style}
            className={classNames(styles.root, {
                [styles.active]: active,
                [styles.loading]: loading,
            })}
            onClick={handlePoolOnClick}
        >
            <div className={styles.pool}>
                {loading ? (
                    <Skeleton circular width="36px" />
                ) : (
                    <PoolRemoteLogo
                        size="lg"
                        token0={{
                            address: pool.token0.address,
                            defaultText: pool.token0.symbol,
                        }}
                        token1={{
                            address: pool.token1.address,
                            defaultText: pool.token1.symbol,
                        }}
                    />
                )}
                <div className={styles.poolInfo}>
                    {loading ? (
                        <Skeleton width="64px" variant="sm" />
                    ) : (
                        <Typography weight="medium" variant="sm">
                            {pool.token1.symbol} / {pool.token0.symbol}
                        </Typography>
                    )}
                    {loading ? (
                        <Skeleton width="32px" variant="xs" />
                    ) : pool.fee ? (
                        <Typography variant="xs" light>
                            {pool.fee / 10_000}%
                        </Typography>
                    ) : null}
                </div>
            </div>
            {loading ? (
                <Skeleton width="64px" variant="sm" />
            ) : (
                <Typography weight="medium" variant="sm">
                    {numeral(pool.usdTvl).format("($ 0.00 a)")}
                </Typography>
            )}
        </div>
    );
}
