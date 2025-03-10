import { Typography } from "@/src/ui/typography";
import styles from "./styles.module.css";
import { Link } from "@/src/i18n/routing";
import { Button } from "@/src/ui/button";
import { useTranslations } from "next-intl";

export function Empty() {
    const t = useTranslations("claims.empty");

    return (
        <div className={styles.root}>
            <Typography weight="medium" uppercase>
                {t("title")}
            </Typography>
            <Typography>{t("body")}</Typography>
            <Link href="/">
                <Button>{t("action")}</Button>
            </Link>
        </div>
    );
}
