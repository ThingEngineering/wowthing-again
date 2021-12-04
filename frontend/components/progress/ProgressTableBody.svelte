<script lang="ts">
    import { userQuestStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import getProgress from '@/utils/get-progress'
    import { tippyComponent } from '@/utils/tippy'
    import type {
        Character,
        StaticDataProgressCategory,
        StaticDataProgressData,
        StaticDataProgressGroup,
    } from '@/types'

    import TooltipProgress from '@/components/tooltips/progress/TooltipProgress.svelte'

    export let category: StaticDataProgressCategory
    export let character: Character
    export let group: StaticDataProgressGroup

    let datas: StaticDataProgressData[]
    let have: number
    let haveIndexes: number[]
    let total: number
    $: {
        ({ datas, have, haveIndexes, total } = getProgress(
            $userQuestStore.data,
            character,
            category,
            group,
        ))
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
    <td
        use:tippyComponent={{
            component: TooltipProgress, props: {datas, group, haveIndexes}
        }}
    >
        <span class="{getPercentClass(have / total * 100)}">{have} / {total}</span>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
