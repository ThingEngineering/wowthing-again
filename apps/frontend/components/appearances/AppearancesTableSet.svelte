<script lang="ts">
    import keys from 'lodash/keys'
    import toPairs from 'lodash/toPairs'

    import {userTransmogStore} from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import {tippyComponent} from '@/utils/tippy'
    import type { ManualDataTransmogGroupData } from '@/types/data/manual'

    import TooltipAppearanceSet from '@/components/tooltips/appearance-set/TooltipAppearanceSet.svelte'
    import WowheadTransmogSetLink from '@/components/links/WowheadTransmogSetLink.svelte'

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
        if (set?.items) {
            for (const [slot, items] of toPairs(set.items)) {
                slotHave[slot] = false
                for (const itemId of items) {
                    if ($userTransmogStore.data.userHas[itemId]) {
                        have++
                        slotHave[slot] = true
                        break
                    }
                }
            }
            total = keys(set.items).length
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
            component: TooltipAppearanceSet,
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
