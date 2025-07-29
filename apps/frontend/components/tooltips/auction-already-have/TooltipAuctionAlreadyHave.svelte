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
        @include cell-width(1.1rem);

        :global(svg) {
            margin-top: -4px;
        }
    }
    .bag {
        @include cell-width(2rem, $maxWidth: 5rem);
    }
    .slot {
        @include cell-width(3rem, $maxWidth: 6rem);
    }
    .character-name {
        @include cell-width(4rem, $maxWidth: 15rem);
    }
    .realm-name {
        @include cell-width(4rem, $maxWidth: 12rem);
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
                            <td class="character-name">{owner.name}</td>
                            <td class="realm-name">{owner.realm.name}</td>
                            <td class="location sized">{ItemLocation[location]}</td>
                        {:else}
                            <td class="character-name" colspan="3">Warband Bank</td>
                        {/if}
                        <td class="count sized r">{count}</td>
                    </tr>
                {/each}
            {:else}
                {#each hasItems as [owner, items]}
                    {#each items as item}
                        <tr>
                            <td class="location drop-shadow">
                                <IconifyIcon icon={itemLocationIcons[item.location]} scale="0.9" />
                            </td>
                            <td class="bag">{item.containerName}</td>
                            <td class="slot">Slot {item.slot}</td>
                            {#if item instanceof WarbankItem}
                                <td class="character-name" colspan="2">Warband Bank</td>
                            {:else}
                                <td class="character-name">{owner.name}</td>
                                <td class="realm-name">{owner.realm.name}</td>
                            {/if}
                        </tr>
                    {/each}
                {/each}
            {/if}
        </tbody>
    </table>
</div>
