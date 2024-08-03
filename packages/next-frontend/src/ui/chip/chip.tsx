import React, { type HTMLAttributes, type ReactNode } from "react";
import classNames from "@/src/utils/classes";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface BaseChipsProps {
    size?: "big" | "small";
    clickable?: boolean;
    active?: boolean;
    className?: { root?: string };
    children: ReactNode;
}

export type ChipProps = BaseChipsProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof BaseChipsProps>;

export const Chip = ({
    size = "small",
    clickable,
    active,
    children,
    className,
    ...rest
}: ChipProps) => (
    <div
        {...rest}
        className={classNames(styles.root, {
            [styles[size]]: true,
            [styles.rootClickable]: clickable,
            [styles.rootActive]: active,
        })}
    >
        <Typography variant="sm" weight="medium">
            {children}
        </Typography>
    </div>
);
