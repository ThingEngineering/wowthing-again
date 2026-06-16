<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { delveMap, type Delve } from '@/data/delve';
    import { iconLibrary } from '@/shared/icons';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';
    import { dynamicDataStore } from '@/user-home/stores/dynamicData';

    import DelvesTooltip from './DelvesTooltip.svelte';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';

    let delves = $derived.by(() => {
        const dynamicDelves = dynamicDataStore.getCached(userState.general.allRegions[0]).delves;
        return sortBy(
            dynamicDelves.map(({ poiId, story }) => [
                delveMap[poiId],
                story,
                settingsState.value.delveRankings[`${poiId}:${story}`],
            ]) as [Delve, string, number][],
            ([delve, , ranking]) => `${9 - ranking}:${delve.shortName}`
        );
    });
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
    {#each delves as [delve, , ranking] (delve)}
        <div class="delve quality{ranking}">
            {delve.shortName}
        </div>
    {/each}
</div>
