<script lang="ts">
    import { delveMap } from '@/data/delve';
    import { iconLibrary } from '@/shared/icons';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { dynamicDataStore } from '@/user-home/stores/dynamicData';

    import DelvesTooltip from './DelvesTooltip.svelte';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import { userState } from '@/user-home/state/user';

    let delves = $derived(dynamicDataStore.getCached(userState.general.allRegions[0]).delves);
</script>

<style lang="scss">
    .flex-wrapper {
        --image-margin-top: -4px;

        gap: var(--padding-size);
    }
    .delve {
        + .delve {
            border-left: 1px solid var(--border-color);
            padding-left: var(--padding-size);
        }
    }
</style>

<div
    class="flex-wrapper"
    use:componentTooltip={{
        component: DelvesTooltip,
        propsFunc: () => ({
            delves,
        }),
    }}
>
    <IconifyWrapper icon={iconLibrary.faDungeon} />
    {#each delves as { poiId, story } (poiId)}
        {@const delve = delveMap[poiId]}
        {#if delve}
            <div class="delve quality{delve.storyRanks[story] ?? 3}">
                {delve.shortName}
            </div>
        {/if}
    {/each}
</div>
