<script lang="ts">
    import { ItemLocation } from '@/enums/item-location';
    import { itemQualities, ItemQuality } from '@/enums/item-quality';
    import { browserState } from '@/shared/state/browser.svelte';
    import { searchState } from './state.svelte';

    import AllNone from './AllNone.svelte';
    import Button from '@/shared/components/forms/Button.svelte';
    import GroupedCheckboxInput from '@/shared/components/forms/GroupedCheckboxInput.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let searchDisabled = $derived(
        browserState.current.itemsSearch.locations.length === 0 ||
            browserState.current.itemsSearch.qualities.length === 0
    );

    const itemLocations = [
        [ItemLocation.Bags, 'Bags'],
        [ItemLocation.Bank, 'Bank'],
        [ItemLocation.Equipped, 'Equipped'],
        [ItemLocation.WarbandBank, 'Warbank'],
        [ItemLocation.GuildBank, 'Guild Bank'],
    ];
</script>

<style lang="scss">
    h4 {
        display: flex;
        justify-content: space-between;
    }
    .options {
        display: flex;
        flex-direction: column;
        gap: calc(var(--padding-size) * 2);
        padding: calc(var(--padding-size) * 2);
    }
    .column-options {
        display: grid;
        grid-auto-flow: column;
        grid-template-rows: repeat(var(--rows), 1fr);
    }
</style>

<div class="options border">
    <div class="option">
        <TextInput
            name="item_name"
            clearButton={true}
            placeholder="Item name..."
            bind:value={browserState.current.itemsSearch.name}
        />
    </div>

    <div class="option">
        <h4>Location <AllNone /></h4>
        <div class="column-options" style:--rows={Math.ceil(itemLocations.length / 2)}>
            {#each itemLocations as [value, text] (value)}
                <GroupedCheckboxInput
                    name="location_{value}"
                    value={value.toString()}
                    bind:bindGroup={browserState.current.itemsSearch.locations}
                    >{text}</GroupedCheckboxInput
                >
            {/each}
        </div>
    </div>

    <div class="option">
        <h4>Quality <AllNone /></h4>
        <div class="column-options" style:--rows={Math.ceil(itemQualities.length / 2)}>
            {#each itemQualities as itemQuality (itemQuality)}
                <GroupedCheckboxInput
                    name="quality_{itemQuality}"
                    textClass="quality{itemQuality}"
                    value={itemQuality.toString()}
                    bind:bindGroup={browserState.current.itemsSearch.qualities}
                    >{ItemQuality[itemQuality]}</GroupedCheckboxInput
                >
            {/each}
        </div>
    </div>

    <Button cls="bg-success" disabled={searchDisabled} onclick={() => searchState.search()}
        >Search</Button
    >
</div>
