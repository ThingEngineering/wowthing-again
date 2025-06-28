<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ManualDataHeirloomGroup } from '@/types/data/manual';

    import Count from '@/components/collectible/CollectibleCount.svelte';
    import Item from './HeirloomsItem.svelte';

    let { group }: { group: ManualDataHeirloomGroup } = $props();

    let groupCount = $derived(userState.heirloomStats[group.name]);
    let isUnavailable = $derived(group.name.startsWith('Unavailable - '));
    let show = $derived(
        !(settingsState.value.collections.hideUnavailable && isUnavailable && groupCount.have === 0)
    );
</script>

<style lang="scss">
    .collection-v2-group {
        width: 17.5rem;
    }
</style>

{#if show}
    <div class="collection-v2-group">
        <h4 class="drop-shadow text-overflow {getPercentClass(groupCount.percent)}">
            {group.name.replace('Unavailable - ', '')}
            <Count counts={groupCount} />
        </h4>

        <div class="collection-objects">
            {#each group.items as item}
                <Item {isUnavailable} {item} />
            {/each}
        </div>
    </div>
{/if}
