"use client";

import { Typography } from "@/src/ui/typography";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { Campaign, SkeletonCampaign } from "./campaign";

import { useTranslations } from "next-intl";
import { usePagination } from "@/src/hooks/usePagination";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
} from "react";
import { TextInput } from "@/src/ui/text-input";
import { SearchIcon } from "@/src/assets/search-icon";
import { useDebounce } from "react-use";
import { filterCampaigns, sortCampaigns } from "@/src/utils/filtering";
import { Pagination } from "@/src/ui/pagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select, type SelectOption } from "@/src/ui/select";
import { Status } from "@metrom-xyz/sdk";
import { useChains } from "wagmi";
import classNames from "@/src/utils/classes";

import styles from "./styles.module.css";

const PAGE_SIZE = 10;
const QUERY_PARAM_PAGE_NUMBER = "page";
const QUERY_PARAM_SEARCH = "search";
const QUERY_PARAM_STATUS = "status";
const QUERY_PARAM_CHAIN = "chainId";

export const CHAIN_ALL = 0;

export enum FilterableStatus {
    All = "",
    Live = Status.Live,
    Upcoming = Status.Upcoming,
    Ended = Status.Ended,
}

export function Campaigns() {
    const t = useTranslations("allCampaigns");
    const chains = useChains();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get(QUERY_PARAM_SEARCH) || "",
    );
    const [status, setStatus] = useState<FilterableStatus>(() => {
        const fromQuery = searchParams.get(QUERY_PARAM_STATUS);
        return fromQuery
            ? (fromQuery as FilterableStatus)
            : FilterableStatus.All;
    });
    const [chain, setChain] = useState(CHAIN_ALL);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [pageNumber, setPageNumber] = useState(
        Number(searchParams.get(QUERY_PARAM_PAGE_NUMBER)) || 1,
    );

    const statusOptions = useMemo(() => {
        return [
            {
                label: t("filters.status.all"),
                value: FilterableStatus.All,
            },
            {
                label: t("filters.status.live"),
                value: FilterableStatus.Live,
            },
            {
                label: t("filters.status.upcoming"),
                value: FilterableStatus.Upcoming,
            },
            {
                label: t("filters.status.ended"),
                value: FilterableStatus.Ended,
            },
        ];
    }, [t]);

    const chainOptions = useMemo(() => {
        const options = [
            {
                label: t("filters.chain.all"),
                value: CHAIN_ALL,
            },
        ];
        for (const chain of chains) {
            options.push({
                label: chain.name,
                value: chain.id,
            });
        }
        return options;
    }, [chains, t]);

    const { loading, campaigns } = useCampaigns();

    useDebounce(
        () => {
            setDebouncedSearch(search);
            const params = new URLSearchParams(searchParams.toString());
            if (search)
                if (params.has(QUERY_PARAM_SEARCH))
                    params.set(QUERY_PARAM_SEARCH, search);
                else params.append(QUERY_PARAM_SEARCH, search);
            else params.delete(QUERY_PARAM_SEARCH);
            router.push(`${pathname}?${params.toString()}`);
        },
        300,
        [search],
    );

    const filteredCampaigns = useMemo(
        () =>
            sortCampaigns(
                filterCampaigns(
                    campaigns,
                    status || FilterableStatus.All,
                    chain,
                    debouncedSearch,
                ),
            ),
        [campaigns, status, chain, debouncedSearch],
    );

    const { data: pagedCampaigns, totalPages } = usePagination({
        data: filteredCampaigns,
        page: pageNumber,
        size: PAGE_SIZE,
    });

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        let updatedPageNumber = pageNumber;
        if (pageNumber > totalPages) {
            updatedPageNumber = totalPages || 1;
            setPageNumber(updatedPageNumber);
        }

        if (updatedPageNumber !== 1) {
            if (params.has(QUERY_PARAM_PAGE_NUMBER))
                params.set(
                    QUERY_PARAM_PAGE_NUMBER,
                    updatedPageNumber.toString(),
                );
            else
                params.append(
                    QUERY_PARAM_PAGE_NUMBER,
                    updatedPageNumber.toString(),
                );
        } else {
            params.delete(QUERY_PARAM_PAGE_NUMBER);
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [pageNumber, pathname, router, searchParams, totalPages]);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    const handleStatusChange = useCallback(
        (status: SelectOption<FilterableStatus>) => {
            const params = new URLSearchParams(searchParams.toString());
            if (status.value)
                if (params.has(QUERY_PARAM_STATUS))
                    params.set(QUERY_PARAM_STATUS, status.value.toString());
                else params.append(QUERY_PARAM_STATUS, status.value.toString());
            else params.delete(QUERY_PARAM_STATUS);
            router.push(`${pathname}?${params.toString()}`);
            setStatus(status.value);
        },
        [pathname, router, searchParams],
    );

    const handleChainChange = useCallback(
        (chain: SelectOption<number>) => {
            const params = new URLSearchParams(searchParams.toString());
            if (chain.value)
                if (params.has(QUERY_PARAM_CHAIN))
                    params.set(QUERY_PARAM_CHAIN, chain.value.toString());
                else params.append(QUERY_PARAM_CHAIN, chain.value.toString());
            else params.delete(QUERY_PARAM_CHAIN);
            router.push(`${pathname}?${params.toString()}`);
            setChain(chain.value);
        },
        [pathname, router, searchParams],
    );

    function handlePreviousPage() {
        setPageNumber((page) => page - 1);
    }

    function handleNextPage() {
        setPageNumber((page) => page + 1);
    }

    function handlePage(page: number) {
        setPageNumber(page);
    }

    return (
        <div className={styles.root}>
            <div className={styles.filters}>
                <TextInput
                    className={styles.filterInput}
                    icon={SearchIcon}
                    iconPlacement="right"
                    label={t("filters.search.label")}
                    placeholder={t("filters.search.label")}
                    value={search}
                    onChange={handleSearchChange}
                />
                <Select
                    options={statusOptions}
                    value={status}
                    onChange={handleStatusChange}
                    label={t("filters.status.label")}
                    messages={{
                        noResults: "",
                    }}
                    className={styles.filterInput}
                />
                <Select
                    options={chainOptions}
                    value={chain}
                    onChange={handleChainChange}
                    label={t("filters.chain.label")}
                    messages={{
                        noResults: "",
                    }}
                    className={styles.filterInput}
                />
            </div>
            <div className={classNames(styles.row, styles.header)}>
                <Typography variant="sm" weight="medium">
                    {t("header.chain")}
                </Typography>
                <Typography variant="sm" weight="medium">
                    {t("header.pool")}
                </Typography>
                <Typography variant="sm" weight="medium">
                    {t("header.status")}
                </Typography>
                <Typography variant="sm" weight="medium">
                    {t("header.apr")}
                </Typography>
                <Typography variant="sm" weight="medium">
                    {t("header.rewards")}
                </Typography>
            </div>
            <div className={styles.body}>
                {loading ? (
                    <>
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                        <SkeletonCampaign />
                    </>
                ) : (
                    pagedCampaigns.map((campaign) => {
                        return (
                            <Campaign key={campaign.id} campaign={campaign} />
                        );
                    })
                )}
            </div>
            <div className={styles.paginationWrapper}>
                <Pagination
                    page={pageNumber}
                    totalPages={totalPages}
                    onNext={handleNextPage}
                    onPrevious={handlePreviousPage}
                    onPage={handlePage}
                />
            </div>
        </div>
    );
}
