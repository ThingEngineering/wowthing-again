<script lang="ts">
    import keys from 'lodash/keys'
    import toPairs from 'lodash/toPairs'

    import {userTransmogStore} from '@/stores'
    import type {Dictionary} from '@/types'
    import type {TransmogDataGroupData} from '@/types/data'
    import getPercentClass from '@/utils/get-percent-class'
    import {tippyComponent} from '@/utils/tippy'

    import TooltipTransmog from '@/components/tooltips/transmog/TooltipTransmog.svelte'

    export let set: TransmogDataGroupData
    export let span = 1
    export let subType: string

    let have = 0
    let total = 0
    let percent = 0
    let slotHave: Dictionary<boolean>
    $: {
        slotHave = {}
        if (set?.items) {
            for (const [slot, items] of toPairs(set.items)) {
                slotHave[slot] = false
                for (const itemId of items) {
                    if ($userTransmogStore.data.transmog[itemId]) {
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
        use:tippyComponent={{component: TooltipTransmog, props: {set, slotHave, subType}}}
    >{have} / {total}</td>
{:else}
    <td class="quality0">---</td>
{/if}
