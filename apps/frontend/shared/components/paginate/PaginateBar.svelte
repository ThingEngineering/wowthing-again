<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { basicTooltip } from '@/shared/utils/tooltips'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'

    export let page: number
    export let pages: number
    export let perPage: number
    export let total: number
    export let url: string
</script>

<style lang="scss">
    .paginate {
        align-items: center;
        display: flex;
        font-size: 1.1rem;

        &:not(:last-child) {
            margin-bottom: 0.5rem;
        }
        &:last-child {
            margin-top: 0.5rem;
        }

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
        border: 1px solid $color-success !important;
    }
    .showing {
        margin-left: 1rem;
    }
</style>

<div class="paginate border">
    {#if page > 1}
        <a href="{url}/1" use:basicTooltip={'First page'}>
            <IconifyIcon icon={iconStrings['page-first']} />
        </a>
    {:else}
        <span>
            <IconifyIcon icon={iconStrings['page-first']} />
        </span>
    {/if}

    {#if (page - 2) > 0}
        <a href="{url}/{page - 2}" use:basicTooltip={`Page ${page - 2}`}>{page - 2}</a>
    {:else}
        <span>&nbsp;</span>
    {/if}

    {#if (page - 1) > 0}
        <a href="{url}/{page - 1}" use:basicTooltip={`Page ${page - 1}`}>{page - 1}</a>
    {:else}
        <span>&nbsp;</span>
    {/if}

    <span class="current">{page}</span>

    {#if (page + 1) <= pages}
        <a href="{url}/{page + 1}" use:basicTooltip={`Page ${page + 1}`}>{page + 1}</a>
    {:else}
        <span>&nbsp;</span>
    {/if}

    {#if (page + 2) <= pages}
        <a href="{url}/{page + 2}" use:basicTooltip={`Page ${page + 2}`}>{page + 2}</a>
    {:else}
        <span>&nbsp;</span>
    {/if}

    {#if page < pages}
        <a href="{url}/{pages}" use:basicTooltip={'Last page'}>
            <IconifyIcon icon={iconStrings['page-last']} />
        </a>
    {:else}
        <span>
            <IconifyIcon icon={iconStrings['page-last']} />
        </span>
    {/if}

    <div class="showing">
        Showing {(page - 1) * perPage + 1}-{Math.min(total, page * perPage)} of {total}
    </div>

    <slot name="bar-end" />
</div>
