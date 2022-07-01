<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'
    import type { StaticDataProgressGroup } from '@/types/data/static'
    import type { ProgressInfo } from '@/utils/get-progress'

    import TooltipProgress from '@/components/tooltips/progress/TooltipProgress.svelte'

    export let character: Character
    export let group: StaticDataProgressGroup
    export let progressData: ProgressInfo
</script>

<style lang="scss">
    td {
        @include cell-width($width-progress, $maxWidth: $width-progress-max);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    span {
        flex: 1;
    }
</style>

{#if progressData.total > 0}
    <td
        use:tippyComponent={{
            component: TooltipProgress,
            props: {
                datas: progressData.datas,
                descriptionText: progressData.descriptionText,
                haveIndexes: progressData.haveIndexes,
                character,
                group,
            },
        }}
    >
        <span class="{getPercentClass(progressData.have / progressData.total * 100)}">{progressData.have} / {progressData.total}</span>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
