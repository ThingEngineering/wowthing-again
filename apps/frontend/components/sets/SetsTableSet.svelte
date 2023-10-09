<script lang="ts">
    import { lazyStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import { tippyComponent } from '@/utils/tippy'
    import type { TransmogSlotData } from '@/stores/lazy/transmog'
    import type { ManualDataTransmogGroupData } from '@/types/data/manual'

    import Tooltip from '@/components/tooltips/appearance-set/TooltipAppearanceSet.svelte'
    import WowheadTransmogSetLink from '@/shared/links/WowheadTransmogSetLink.svelte'

    export let set: ManualDataTransmogGroupData
    export let setKey: string
    export let setTitle: string
    export let span = 1
    export let subType: string

    let have: number
    let percent: number
    let total: number
    let slotHave: TransmogSlotData
    $: {
        have = 0
        percent = 0
        total = 0
        
        slotHave = $lazyStore.transmog.slots[setKey]
        if (!set || !slotHave) { break $ }

        const stats = $lazyStore.transmog.stats[setKey]
        if (stats?.total > 0) {
            have = stats.have
            total = stats.total
        }
        else {
            have = Object.values(slotHave).filter((s) => s[0] === true).length
            total = Object.keys(slotHave).length
        }

        if (total > 0) {
            percent = have / total * 100
        }
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        padding-left: 0.4rem;
        padding-right: 0.4rem;
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
            props: {
                set,
                setTitle,
                slotHave,
                subType,
            },
            tippyProps: {
                allowHTML: true,
                placement: 'left-end',
            },
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
