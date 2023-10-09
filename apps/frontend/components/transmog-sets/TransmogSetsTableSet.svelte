<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class'
    import { tippyComponent } from '@/utils/tippy'
    import type { UserCount } from '@/types'
    import type { ManualDataTransmogSetSet } from '@/types/data/manual'

    import Tooltip from '@/components/tooltips/appearance-set/TooltipAppearanceSet.svelte'
    import WowheadTransmogSetLink from '@/shared/links/WowheadTransmogSetLink.svelte'

    export let set: ManualDataTransmogSetSet
    export let span = 1
    export let stats: UserCount
    export let subType: string

    let have: number
    let percent: number
    let total: number
    let slotHave: Record<string, boolean>
    $: {
        have = stats?.have ?? 0
        total = stats?.total ?? 0
        percent = total === 0 ? 0 : have / total * 100

        slotHave = {}
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        text-align: center;
        word-spacing: -0.2ch;
    }
</style>

{#if total > 0}
    <td
        class="{getPercentClass(percent)}"
        colspan="{span}"
        use:tippyComponent={{
            component: Tooltip,
            props: {set, slotHave, subType},
            tippyProps: {placement: 'left-end'},
        }}
    >
        {#if set.wowheadSetId}
            <WowheadTransmogSetLink
                id={set.wowheadSetId}
                cls="{getPercentClass(percent)}"
            >
                {have} / {total}
            </WowheadTransmogSetLink>
        {:else}
            {have} / {total}
        {/if}
    </td>
{:else}
    <td class="quality0" colspan="{span}">---</td>
{/if}
