<script lang="ts">
    import some from 'lodash/some'

    import { reputationState } from '@/stores/local-storage'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { StaticDataReputationSet } from '@/stores/static/types'

    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import Tooltip from '@/components/tooltips/reputation-header/TooltipReputationHeader.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

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

        onClick = function() {
            $reputationState.sortOrder[slug] = sortingBy ? [] : repIds
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
    .faction0, .faction1 {
        --image-border-width: 2px;
    }
</style>

<th
    data-reputation-ids={repIds.filter((id) => id > 0).join(',')}
    on:click|preventDefault={onClick}
    use:componentTooltip={{
        component: Tooltip,
        props: {reputation},
    }}
>
    {#if reputation.both}
        <div class="split-icon-no">
            <WowthingImage
                name={reputation.both.icon}
                size={40}
                border={2}
            />
        </div>
    {:else if reputation.alliance && reputation.horde}
        <div class="split-icon-yes">
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
    {:else if reputation.alliance}
        <div class="faction0">
            <WowthingImage
                name={reputation.alliance.icon}
                size={40}
                border={2}
            />
        </div>
    {:else if reputation.horde}
        <div class="faction1">
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
