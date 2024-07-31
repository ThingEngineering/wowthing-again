<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'
    import type { ManualDataProgressGroup } from '@/types/data/manual'
    import type { ProgressInfo } from '@/utils/get-progress'

    import TooltipProgress from '@/components/tooltips/progress/TooltipProgress.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let group: ManualDataProgressGroup
    export let progressData: ProgressInfo
</script>

<style lang="scss">
    td {
        @include cell-width($width-progress, $maxWidth: $width-progress-max);

        border-left: 1px solid $border-color;
        text-align: right;

        &.status-fail {
            text-align: center;
        }
    }
    .has-icon {
        @include cell-width(3.7rem, $maxWidth: $width-progress-max);

        :global(img) {
            margin-right: 2px;
        }
    }
    span {
        flex: 1;
    }
</style>

{#if progressData?.total > 0}
    <td
        class:has-icon={!!progressData.icon}
        use:componentTooltip={{
            component: TooltipProgress,
            props: {
                datas: progressData.datas,
                descriptionText: progressData.descriptionText,
                haveIndexes: progressData.haveIndexes,
                iconOverride: progressData.icon,
                nameOverride: progressData.nameOverride,
                showCurrencies: [progressData.showCurrency],
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

        <span
            class="{progressData.missingRequired ? 'status-fail' : getPercentClass(progressData.have / progressData.total * 100)}"
        >{progressData.have} / {progressData.total}</span>
    </td>
{:else if progressData?.have === -1 && progressData?.total >= 0}
    <td class="status-fail">---</td>
{:else if (group.minimumLevel || 0) > character.level}
    <td class="status-fail">
        <span>{group.minimumLevel}+</span>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
