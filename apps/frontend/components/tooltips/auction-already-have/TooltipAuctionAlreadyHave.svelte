<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { itemLocationIcons } from '@/shared/icons/mappings';
    import { WarbankItem } from '@/types/items';
    import { ItemLocation } from '@/enums/item-location';
    import type { HasNameAndRealm, UserItem } from '@/types/shared';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    type Props = {
        groupItems?: boolean;
        hasItems: [HasNameAndRealm, UserItem[]][];
    };
    let { groupItems = false, hasItems }: Props = $props();

    let groupedItems = $derived.by(() => {
        const bySource: Record<string, [HasNameAndRealm, ItemLocation, number]> = {};

        for (const [source, items] of hasItems) {
            for (const item of items) {
                const key = [source?.realm?.name, source?.name, item.location].join('|');
                bySource[key] ||= [source, item.location, 0];
                bySource[key][2] += 1;
            }
        }

        return sortBy(Object.values(bySource), ([, , count]) => -count);
    });
</script>

<style lang="scss">
    table {
        --padding: 2;

        width: auto;
    }
    td {
        text-align: left;
        white-space: nowrap;
    }
    .location {
        --width: 1.1rem;

        :global(svg) {
            margin-top: -4px;
        }
    }
    .bag {
        --max-width: 5rem;
        --width: 2rem;
    }
    .slot {
        --max-width: 6rem;
        --width: 3rem;
    }
    .character-name {
        --max-width: 15rem;
        --width: 4rem;
    }
    .realm-name {
        --max-width: 12rem;
        --width: 4rem;
    }
    .location {
        --width: 3rem;
    }
    .count {
        --width: 1rem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>Existing Items</h4>
    <table class="table table-striped">
        <tbody>
            {#if groupItems}
                {#each groupedItems as [owner, location, count]}
                    <tr>
                        {#if owner}
                            <td class="character-name max-width">{owner.name}</td>
                            <td class="realm-name max-width">{owner.realm.name}</td>
                            <td class="location">{ItemLocation[location]}</td>
                        {:else}
                            <td class="character-name max-width" colspan="3">Warband Bank</td>
                        {/if}
                        <td class="count r">{count}</td>
                    </tr>
                {/each}
            {:else}
                {#each hasItems as [owner, items]}
                    {#each items as item}
                        <tr>
                            <td class="location drop-shadow">
                                <IconifyIcon icon={itemLocationIcons[item.location]} scale="0.9" />
                            </td>
                            <td class="bag max-width">{item.containerName}</td>
                            <td class="slot max-width">Slot {item.slot}</td>
                            {#if item instanceof WarbankItem}
                                <td class="character-name max-width" colspan="2">Warband Bank</td>
                            {:else}
                                <td class="character-name max-width">{owner.name}</td>
                                <td class="realm-name max-width">{owner.realm.name}</td>
                            {/if}
                        </tr>
                    {/each}
                {/each}
            {/if}
        </tbody>
    </table>
</div>
