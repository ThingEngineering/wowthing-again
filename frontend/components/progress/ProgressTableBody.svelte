<script lang="ts">
    import type { Character, StaticDataProgressData, StaticDataProgressGroup } from '@/types'
    import getPercentClass from '@/utils/get-percent-class'
    import { getProgress } from '@/utils/get-progress'
    import { tippyComponent } from '@/utils/tippy'

    import TooltipProgress from '@/components/tooltips/progress/TooltipProgress.svelte'

    export let character: Character
    export let group: StaticDataProgressGroup

    let datas: StaticDataProgressData[]
    let have: number
    let total: number
    $: {
        ({ datas, have, total } = getProgress(character, group))
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-progress);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    span {
        flex: 1;
    }
</style>

{#if total > 0}
    <td use:tippyComponent={{component: TooltipProgress, props: {datas, group, have}}}>
        <span class="{getPercentClass(have / total * 100)}">{have} / {total}</span>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
