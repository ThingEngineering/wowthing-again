<script lang="ts">
    import { itemStore, settingsStore, staticStore, userTransmogStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import { tippyComponent } from '@/utils/tippy'
    import type { ManualDataTransmogGroupData } from '@/types/data/manual'

    import Tooltip from '@/components/tooltips/appearance-set/TooltipAppearanceSet.svelte'
    import WowheadTransmogSetLink from '@/components/links/WowheadTransmogSetLink.svelte'
    import { InventoryType } from '@/enums';

    export let set: ManualDataTransmogGroupData
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
        
        if (!set) { break $ }

        if (set.transmogSetId) {
            const transmogSet = $staticStore.transmogSets[set.transmogSetId]
            for (const [itemId, maybeModifier] of transmogSet.items) {
                const modifier = maybeModifier || 0
                const item = $itemStore.items[itemId]
                const actualSlot = item.inventoryType === InventoryType.Chest2 ? InventoryType.Chest : item.inventoryType
                if (slotHave[actualSlot]) {
                    continue
                }
                slotHave[actualSlot] = false

                let userHas = false
                if (
                    $settingsStore.transmog.completionistMode
                    || transmogSet.allianceOnly
                    || transmogSet.hordeOnly
                )
                {
                    userHas = $userTransmogStore.hasSource.has(`${itemId}_${modifier}`)
                }
                else {
                    const appearance = item.appearances[modifier]
                    userHas = $userTransmogStore.hasAppearance.has(appearance.appearanceId)
                }

                if (userHas) {
                    have++
                    slotHave[actualSlot] = true
                }
            }

            total = Object.keys(slotHave).length
        }
        else if (set.items) {
            for (const [slot, items] of Object.entries(set.items)) {
                slotHave[slot] = false
                for (const itemId of items) {
                    if ($userTransmogStore.hasAppearance.has(itemId)) {
                        have++
                        slotHave[slot] = true
                        break
                    }
                }
            }
            total = Object.keys(set.items).length
        }

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
