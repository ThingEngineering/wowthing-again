<script lang="ts" generics="TData">
    import { router } from 'svelte-spa-router';

    import PaginateBar from './PaginateBar.svelte';
    import type _ from 'lodash';

    type Props = {
        items: TData[];
        page: number;
        perPage: number;
    };
    let { items, page, perPage }: Props = $props();

    let pages = $derived(Math.ceil(items.length / perPage));
    let derivedPage = $derived(Math.max(1, Math.min(pages, page)));
    let start = $derived((page - 1) * perPage);
    let end = $derived(start + perPage);

    let url = $derived('#' + router.location.replace(/\/?\d+$/, ''));

    let pageItems = $derived(items.slice(start, end));
</script>

{#if items.length > 0}
    <PaginateBar total={items.length} page={derivedPage} {pages} {perPage} {url}>
        <slot name="bar-end" slot="bar-end"></slot>
    </PaginateBar>
{/if}

<slot paginated={pageItems} />

{#if items.length > 0}
    <PaginateBar total={items.length} page={derivedPage} {pages} {perPage} {url} />
{/if}
