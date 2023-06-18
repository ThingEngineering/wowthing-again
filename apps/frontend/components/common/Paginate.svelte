<script lang="ts">
    import { location } from 'svelte-spa-router'

    import { iconStrings } from '@/data/icons'
    import tippy from '@/utils/tippy'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let items: any[]
    export let page: number
    export let perPage: number

    let end: number
    let pages: number
    let start: number
    let url: string
    $: {
        pages = Math.ceil(items.length / perPage)
        page = Math.max(1, Math.min(pages, page))
        start = (page - 1) * perPage
        end = start + perPage

        url = '#' + $location.replace(/\/?\d+$/, '')
    }
</script>

<style lang="scss">
    .paginate {
        align-items: center;
        display: flex;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;

        :global(svg) {
            margin-top: -4px;
        }

        a, span {
            display: inline-block;
            text-align: center;
            width: 2.5rem;

            border-left: 1px solid $border-color;
            border-right: 1px solid $border-color;
        }
    }
    .current {
        border: 1px solid $colour-success !important;
    }
    .showing {
        margin-left: 1rem;
    }
</style>

{#if items.length > 0}
    <div class="paginate border">
        {#if page > 1}
            <a href="{url}/1" use:tippy={'First page'}>
                <IconifyIcon icon={iconStrings['page-first']} />
            </a>
        {:else}
            <span>
                <IconifyIcon icon={iconStrings['page-first']} />
            </span>
        {/if}

        {#if (page - 2) > 0}
            <a href="{url}/{page - 2}" use:tippy={`Page ${page - 2}`}>{page - 2}</a>
        {:else}
            <span>&nbsp;</span>
        {/if}

        {#if (page - 1) > 0}
            <a href="{url}/{page - 1}" use:tippy={`Page ${page - 1}`}>{page - 1}</a>
        {:else}
            <span>&nbsp;</span>
        {/if}

        <span class="current">{page}</span>

        {#if (page + 1) <= pages}
            <a href="{url}/{page + 1}" use:tippy={`Page ${page + 1}`}>{page + 1}</a>
        {:else}
            <span>&nbsp;</span>
        {/if}

        {#if (page + 2) <= pages}
            <a href="{url}/{page + 2}" use:tippy={`Page ${page + 2}`}>{page + 2}</a>
        {:else}
            <span>&nbsp;</span>
        {/if}

        {#if page < pages}
            <a href="{url}/{pages}" use:tippy={'Last page'}>
                <IconifyIcon icon={iconStrings['page-last']} />
            </a>
        {:else}
            <span>
                <IconifyIcon icon={iconStrings['page-last']} />
            </span>
        {/if}

        <div class="showing">
            Showing {(page - 1) * perPage + 1}-{Math.min(items.length, page * perPage)} of {items.length}
        </div>
    </div>
{/if}

<slot paginated={items.slice(start, end)} />
