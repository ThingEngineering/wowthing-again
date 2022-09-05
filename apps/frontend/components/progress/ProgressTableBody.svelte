<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'
    import type { ManualDataProgressGroup } from '@/types/data/manual'
    import type { ProgressInfo } from '@/utils/get-progress'

    import TooltipProgress from '@/components/tooltips/progress/TooltipProgress.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let group: ManualDataProgressGroup
    export let progressData: ProgressInfo
</script>

<style lang="scss">
    td {
        @include cell-width($width-progress, $maxWidth: $width-progress-max);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    .has-icon {
        width: 4.8rem;
    }
    span {
        flex: 1;
    }
</style>

{#if progressData.total > 0}
    <td
        class:has-icon={!!progressData.icon}
        use:tippyComponent={{
            component: TooltipProgress,
            props: {
                datas: progressData.datas,
                descriptionText: progressData.descriptionText,
                haveIndexes: progressData.haveIndexes,
                iconOverride: progressData.icon,
                nameOverride: progressData.nameOverride,
                showCurrency: progressData.showCurrency,
                character,
                group,
            },
        }}
    >
        {#if progressData.icon}
            <WowthingImage
                name={progressData.icon}
                size={20}
            />
        {/if}

        <span class="{getPercentClass(progressData.have / progressData.total * 100)}">
            {progressData.have} / {progressData.total}
        </span>
    </td>
{:else if progressData.have === -1 && progressData.total >= 0}
    <td class="status-fail">---</td>
{:else}
    <td>&nbsp;</td>
{/if}
