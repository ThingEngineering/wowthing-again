<script lang="ts">
    import { lazyStore } from '@/stores'
    import { settingsStore } from '@/shared/stores/settings'
    import getPercentClass from '@/utils/get-percent-class'
    import type { ManualDataHeirloomGroup } from '@/types/data/manual'

    import Count from '@/components/collectible/CollectibleCount.svelte'
    import Item from './HeirloomsItem.svelte'

    export let group: ManualDataHeirloomGroup

    $: groupCount = $lazyStore.heirlooms[group.name]
    $: isUnavailable = group.name.startsWith('Unavailable - ')
    $: show = !($settingsStore.collections.hideUnavailable && isUnavailable && groupCount.have === 0)
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
