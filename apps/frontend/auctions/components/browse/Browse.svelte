<script lang="ts">
    import { onMount } from 'svelte';
    import { replace, router } from 'svelte-spa-router';

    import { browseStore } from './store';
    import { auctionsAppState } from '@/auctions/stores/state';
    import { Region } from '@/enums/region';
    import { auctionStore } from '@/stores/auction';
    import type { MultiSlugParams } from '@/types';
    import type { AuctionCategory } from '@/types/data/auction';

    import Results from '@/auctions/components/results/Results.svelte';

    type Props = {
        baseUrlPrefix?: string;
        params: MultiSlugParams;
    };
    let { baseUrlPrefix, params }: Props = $props();

    let [categories, category, selected] = $derived.by(() => {
        let retCategories: AuctionCategory[];
        let retCategory: AuctionCategory;
        let retSelected: string;

        const usefulParams = [params.slug2, params.slug3, params.slug4, params.slug5].filter(
            (slug) => !!slug
        );

        const newCategories: AuctionCategory[] = [];
        let newCategory: AuctionCategory = undefined;
        let newSelected: string = undefined;
        for (const param of usefulParams) {
            if (param.indexOf(':') > 0) {
                newSelected = param;
                continue;
            }

            if (!newCategory) {
                newCategory = $auctionStore.categories.filter((cat) => cat.slug === param)[0];
            } else {
                newCategory = (newCategory.children || []).filter((cat) => cat.slug === param)[0];
            }

            if (!newCategory) {
                break;
            }
            newCategories.push(newCategory);
        }

        if (
            !retCategories ||
            retCategories.map((c) => c.slug).join('|') !==
                newCategories.map((c) => c.slug).join('|')
        ) {
            retCategories = newCategories;
        }
        if (newCategory?.id !== retCategory?.id) {
            retCategory = newCategory;
        }
        if (newSelected !== retSelected) {
            retSelected = newSelected;
        }

        return [retCategories, retCategory, retSelected];
    });

    let loadFunc = $derived(
        async () => await browseStore.fetch($auctionsAppState, $auctionStore, category.id)
    );

    onMount(() => {
        if (params.slug1) {
            const oldRegion = $auctionsAppState.region;
            const newRegion = Region[params.slug1.toUpperCase() as keyof typeof Region];
            if (oldRegion !== newRegion) {
                $auctionsAppState.region = newRegion;
                if (oldRegion) {
                    replace(
                        router.location.replace(
                            `/${Region[oldRegion].toLowerCase()}/`,
                            `/${Region[newRegion].toLowerCase()}/`
                        )
                    );
                }
            }
        }
    });
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0;
    }
    .header {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
    }
</style>

<div class="wrapper-column">
    {#if category?.browseable}
        <div class="header">
            <span>
                <code>[{Region[$auctionsAppState.region]}]</code>
                Browse
            </span>
            {#each categories as category, categoryIndex (category.id)}
                <span>&gt;</span>
                <a
                    href="#/browse/{params.slug1}/{categories
                        .slice(0, categoryIndex + 1)
                        .map((c) => c.slug)
                        .join('/')}"
                >
                    {category.name}
                </a>
            {/each}
        </div>

        <Results
            url={`#${baseUrlPrefix || ''}/browse/${params.slug1}/${categories.map((c) => c.slug).join('/')}`}
            {loadFunc}
            {selected}
        />
    {/if}
</div>
