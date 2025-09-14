<script lang="ts">
    import { uiIcons } from '@/shared/icons/ui';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { activeViewProgress } from '@/user-home/state/activeViewProgress.svelte';
    import getProgress from '@/utils/get-progress';
    import type { CharacterProps } from '@/types/props';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import TooltipProgress from '@/components/tooltips/progress/TooltipProgress.svelte';

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
        {#if data.datas}
            <td
                class="b-l c"
                class:status-success={data.have > 0 && data.have === data.total}
                class:status-shrug={data.have > 0 && data.have < data.total}
                class:status-fail={data.have === 0}
                use:componentTooltip={{
                    component: TooltipProgress,
                    propsFunc: () => ({
                        datas: data.datas,
                        descriptionText: data.descriptionText,
                        haveIndexes: data.haveIndexes,
                        iconOverride: data.icon,
                        nameOverride: data.nameOverride,
                        showCurrencies: [] as number[],
                        character,
                        group,
                    }),
                }}
            >
                {#if data.have > 0 && data.have === data.total}
                    <IconifyIcon icon={uiIcons.starFull} />
                {:else}
                    {data.have} / {data.total}
                {/if}
            </td>
        {:else}
            <td class="b-l c">---</td>
        {/if}
    {/each}
{/key}
