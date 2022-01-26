<script lang="ts">
    import some from 'lodash/some'

    import { reputationState } from '@/stores/local-storage'
    import { tippyComponent } from '@/utils/tippy'
    import type { StaticDataReputationSet } from '@/types/data/static'

    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import Tooltip from '@/components/tooltips/reputation-header/TooltipReputationHeader.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let reputation: StaticDataReputationSet
    export let slug: string

    let onClick: (event: Event) => void
    let repIds: number[]
    let sortingBy: boolean
    $: {
        repIds = [
            reputation.both?.id ?? 0,
            reputation.alliance?.id ?? 0,
            reputation.horde?.id ?? 0,
        ]
        sortingBy = some(
            $reputationState.sortOrder[slug] || [],
            (repId) => repId > 0 && repIds.indexOf(repId) >= 0
        )

        onClick = function(event: Event) {
            event.preventDefault()
            $reputationState.sortOrder[slug] = sortingBy ? [] : [
                reputation.both?.id ?? 0,
                reputation.alliance?.id ?? 0,
                reputation.horde?.id ?? 0,
            ]
        }
    }
</script>

<style lang="scss">
    th {
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding: 0.3rem 0;
        position: relative;
        min-width: $width-reputation;
        width: $width-reputation;
    }
    div {
        display: inline-block;
        position: relative;
        height: 44px;
        width: 44px;
    }
    .split-no {
        border: 2px solid lighten($border-color, 20%);
        border-radius: $border-radius;
    }
    .split-yes :global(img:first-child) {
        border: 2px solid $alliance-border;
        clip-path: polygon(0 0, 0 100%, 100% 0);
    }
    .split-yes :global(img:last-child) {
        border: 2px solid $horde-border;
        clip-path: polygon(100% 100%, 0 100%, 100% 0);
        position: absolute;
        bottom: 0;
        right: 0;
        //margin-top: -64px;
    }
</style>

<th
    on:click|preventDefault={onClick}
    use:tippyComponent={{
        component: Tooltip,
        props: {reputation},
    }}
>
    {#if reputation.both}
        <div class="split-no">
            <WowthingImage
                name={reputation.both.icon}
                size={40}
                border={2}
            />
        </div>
    {:else}
        <div class="split-yes">
            <WowthingImage
                name={reputation.alliance.icon}
                size={40}
                border={2}
            />
            <WowthingImage
                name={reputation.horde.icon}
                size={40}
                border={2}
            />
        </div>
    {/if}

    {#if sortingBy}
        <TableSortedBy />
    {/if}
</th>
