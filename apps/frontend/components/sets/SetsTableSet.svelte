<script lang="ts">
    import { itemStore, lazyStore, settingsStore, staticStore, userTransmogStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import { tippyComponent } from '@/utils/tippy'
    import type { ManualDataTransmogGroupData } from '@/types/data/manual'

    import Tooltip from '@/components/tooltips/appearance-set/TooltipAppearanceSet.svelte'
    import WowheadTransmogSetLink from '@/components/links/WowheadTransmogSetLink.svelte'
    import { InventoryType } from '@/enums';

    export let set: ManualDataTransmogGroupData
    export let setKey: string
    export let span = 1
    export let subType: string

    let have: number
    let percent: number
    let total: number
    let slotHave: Record<string, boolean>
    $: {
        have = 0
        percent = 0
        total = 0
        slotHave = {}
        
        slotHave = $lazyStore.transmog.slots[setKey]

        if (!set || !slotHave) { break $ }

        total = Object.keys(slotHave).length
        have = Object.values(slotHave).filter((s) => s === true).length

        if (total > 0) {
            percent = have / total * 100
        }
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
