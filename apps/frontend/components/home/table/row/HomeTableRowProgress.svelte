<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { activeViewProgress } from '@/user-home/state/activeViewProgress.svelte';
    import getProgress from '@/utils/get-progress';
    import type { CharacterProps } from '@/types/props';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import TooltipProgress from '@/components/tooltips/progress/TooltipProgress.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        --width: 2rem;
    }
</style>

{#key settingsState.activeView.id}
    {#each activeViewProgress.value as [progressKey, category, group] (progressKey)}
        {@const data = getProgress(character, category, group, false)}
        <td
            class="sized b-l c"
            class:status-success={data.have === data.total}
            class:status-shrug={data.have > 0 && data.have < data.total}
            class:status-fail={data.have === 0}
            use:componentTooltip={{
                component: TooltipProgress,
                props: {
                    datas: data.datas,
                    descriptionText: data.descriptionText,
                    haveIndexes: data.haveIndexes,
                    iconOverride: data.icon,
                    nameOverride: data.nameOverride,
                    showCurrencies: [],
                    character,
                    group,
                },
            }}
        >
            {#if data.have === data.total}
                <ParsedText text=":starFull:" />
            {:else}
                {data.have} / {data.total}
            {/if}
        </td>
    {/each}
{/key}
