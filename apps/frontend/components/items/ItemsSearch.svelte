<script lang="ts">
    import sortBy from 'lodash/sortBy';
    import { onMount, tick } from 'svelte';
    import { replace } from 'svelte-spa-router';

    import { ItemLocation } from '@/enums/item-location';
    import { ItemQuality } from '@/enums/item-quality';
    import { itemSearchState, userStore } from '@/stores';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import type { ItemSearchResponseItem } from '@/types/items';

    import CharacterTable from './ItemsSearchCharacterTable.svelte';
    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import ItemTable from './ItemsSearchItemTable.svelte';
    import RadioGroup from '@/shared/components/forms/RadioGroup.svelte';
    import Select from '@/shared/components/forms/Select.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';
    import { sharedState } from '@/shared/state/shared.svelte';

    let response: ItemSearchResponseItem[] = $state([]);

    let formValid = $derived($itemSearchState.isValid);

    onMount(() => {
        if (sharedState.public) {
            replace('/items/bags');
        }

        if (formValid) {
            document.getElementById('item-search-submit').click();
        }
    });

    const onSubmit = async function () {
        response = await $itemSearchState.search();
        for (const item of response) {
            item.characters = sortBy(item.characters, (char) => [
                1000000000 - char.count,
                $userStore.characterMap[char.characterId].name,
            ]);
        }
    };

    let containerElement: HTMLElement = $state(null);
    let resizeableElement: HTMLElement = $state(null);
    let debouncedResize: () => void = $derived.by(() => {
        if (resizeableElement) {
            return getColumnResizer(containerElement, resizeableElement, 'search-table', {
                columnCount: '--column-count',
                gap: 20,
                minColumns: 2,
                padding: '0.75rem',
            });
        } else {
            debouncedResize = null;
        }
    });

    // FIX: hacky, work out how to listen for resize events instead
    $effect.pre(() => {
        tick().then(() => debouncedResize?.());
    });
</script>

<style lang="scss">
    .thing-container {
        border: 1px solid $border-color;
        padding: 1rem 0.75rem;
    }
    form {
        align-items: center;
        display: flex;
        gap: 0.8rem;
    }
    .option {
        align-items: center;
        display: flex;
        gap: 0.2rem;
    }
    .results-container {
        column-count: max(2, var(--column-count, 1));
        column-gap: 20px;
        margin-top: 1rem;

        :global(table) {
            --padding: 2;

            display: inline-block;
            margin-bottom: 0.5rem;
            width: 29.5rem;
        }
    }

    button {
        cursor: pointer;
    }
    .state-valid {
        background: #0f4f0f;
        color: $body-text;
    }
    .state-invalid {
        background: #4f0f0f;
        color: #bbb;
    }
</style>

<svelte:window on:resize={debouncedResize} />

<div class="wrapper-column" bind:this={containerElement}>
    <div class="thing-container" bind:this={resizeableElement}>
        <form on:submit|preventDefault={onSubmit}>
            <TextInput
                name="terms"
                maxlength={20}
                placeholder="Search terms"
                bind:value={$itemSearchState.searchTerms}
            />

            <div class="option">
                <span>Location:</span>
                <Select
                    name="location"
                    width="9rem"
                    bind:selected={$itemSearchState.location}
                    options={[
                        [ItemLocation.Any, '-Any-'],
                        [ItemLocation.Bags, 'Bags'],
                        [ItemLocation.Bank, 'Bank'],
                        [ItemLocation.Reagent, 'Reagent Bank'],
                        [ItemLocation.WarbandBank, 'Warband Bank'],
                        [ItemLocation.GuildBank, 'Guild Bank'],
                    ]}
                />
            </div>

            <div class="option">
                <span>Group by:</span>
                <RadioGroup
                    bind:value={$itemSearchState.groupBy}
                    name="sort_by"
                    options={[
                        ['character', 'Character'],
                        ['item', 'Item'],
                    ]}
                />
            </div>

            <Checkbox name="include_equipped" bind:value={$itemSearchState.includeEquipped}
                >Include equipped</Checkbox
            >

            <div class="option">
                <span>Min quality:</span>
                <Select
                    name="minimum_quality"
                    width="8rem"
                    bind:selected={$itemSearchState.minimumQuality}
                    options={[
                        [ItemQuality.Poor, 'Poor'],
                        [ItemQuality.Common, 'Common'],
                        [ItemQuality.Uncommon, 'Uncommon'],
                        [ItemQuality.Rare, 'Rare'],
                        [ItemQuality.Epic, 'Epic'],
                        [ItemQuality.Legendary, 'Legendary'],
                    ]}
                />
            </div>

            <button
                id="item-search-submit"
                class="border"
                class:state-valid={formValid}
                class:state-invalid={!formValid}
                disabled={!formValid}
                type="submit">Search!</button
            >
        </form>

        {#if response !== undefined}
            <div class="results-container">
                {#if $itemSearchState.groupBy === 'character'}
                    <CharacterTable {response} />
                {:else}
                    <ItemTable {response} />
                {/if}
            </div>
        {/if}
    </div>
</div>
