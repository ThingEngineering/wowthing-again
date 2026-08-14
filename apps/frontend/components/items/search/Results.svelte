<script lang="ts">
    import { ItemLocation } from '@/enums/item-location';
    import { searchState } from './state.svelte';
    import { wowthingData } from '@/shared/stores/data';
</script>

{#if searchState.inProgress}
    Searching...
{:else if searchState.results !== null}
    {#each searchState.results as [location, entityId, itemId]}
        {@const item = wowthingData.items.items[itemId]}
        <div>
            <div>
                {ItemLocation[location]}
            </div>
            <div>
                {#if entityId > 0}
                    {entityId}
                {/if}
            </div>
            <div>
                {item.name}
            </div>
        </div>
    {/each}
{/if}
