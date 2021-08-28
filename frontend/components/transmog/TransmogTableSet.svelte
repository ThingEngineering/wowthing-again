<script lang="ts">
    import keys from 'lodash/keys'

    import type {TransmogDataGroupData} from '@/types/data'
    import getPercentClass from '@/utils/get-percent-class'

    export let set: TransmogDataGroupData
    export let span = 1

    let have: number
    let total: number
    let percent: number

    $: {
        total = keys(set.items).length
        have = Math.round(Math.random() * total)
        percent = have / total * 100
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        text-align: center;
        word-spacing: -0.2ch;
    }
</style>

<td class="{getPercentClass(percent)}" colspan="{span}">{have} / {total}</td>
