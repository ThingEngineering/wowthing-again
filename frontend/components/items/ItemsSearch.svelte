<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import { onMount } from 'svelte'
    import { location, querystring, replace } from 'svelte-spa-router'

    import { itemSearchState, userStore } from '@/stores'
    import { ItemLocation } from '@/types/enums'
    import { getItemUrlSearch } from '@/utils/get-item-url'
    import { toNiceNumber } from '@/utils/to-nice'
    import type { ItemSearchResponseItem } from '@/types/items'

    import Select from '@/components/forms/Select.svelte'
    import TextInput from '@/components/forms/TextInput.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    let formValid: boolean
    let response: ItemSearchResponseItem[]

    $: {
        // Parse query string
        const parsed = new URLSearchParams($querystring)
        itemSearchState.update(state => {
            state.searchTerms = parsed.get('terms') || ''
            state.location = parseInt(parsed.get('location')) || 0
            return state
        })
    }

    $: {
        formValid = $itemSearchState.isValid
    }

    onMount(() => {
        if (formValid) {
            document.getElementById('item-search-submit').click()
        }
    })

    const onSubmit = async function() {
        response = await $itemSearchState.search()
        for (const item of response) {
            item.characters = sortBy(
                item.characters,
                (char) => [
                    1000000000 - char.count,
                    $userStore.data.characterMap[char.characterId].name
                ]
            )
        }

        // Update query string
        const queryParts = []
        if ($itemSearchState.isValid) {
            if ($itemSearchState.searchTerms !== '') {
                queryParts.push(`terms=${$itemSearchState.searchTerms}`)
            }
            if ($itemSearchState.location != ItemLocation.Any) {
                queryParts.push(`location=${$itemSearchState.location}`)
            }
        }

        const qs = queryParts.join('&')
        if (qs !== $querystring) {
            replace($location + (qs ? '?' + qs : ''))
        }
    }
</script>

<style lang="scss">
    .thing-container {
        border: 1px solid $border-color;
        padding: 1rem 0.75rem;
        width: 100%;
    }
    form {
        display: flex;
        gap: 0.5rem;
    }
    .results-container {
        column-count: 2;
        margin-top: 1rem;
        width: 60rem;
    }

    .state-valid {
        background: #0f4f0f;
        color: $body-text;
    }
    .state-invalid {
        background: #4f0f0f;
        color: #bbb;
    }

    table {
        display: inline-block;
        margin-bottom: 0.5rem;
    }
    .item-row {
        th {
            background-color: $highlight-background;
            font-weight: normal;
        }
    }
    .item {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding: 0.2rem $width-padding;
        text-align: left;
    }
    .name {
        @include cell-width($width-name);

        a {
            text-decoration: underline;
        }
    }
    .realm {
        @include cell-width($width-realm);
    }
    .location {
        @include cell-width($width-item-location);
    }
    .count {
        @include cell-width($width-item-count);

        text-align: right;
    }
    .item-level {
        @include cell-width($width-item-level);

        text-align: right;
    }
</style>

<div class="thing-container">
    <form
        on:submit|preventDefault={onSubmit}
    >
        <TextInput
            name="terms"
            maxlength={20}
            placeholder="Search terms"
            bind:value={$itemSearchState.searchTerms}
        />

        <span>in</span>

        <Select
            name="location"
            bind:selected={$itemSearchState.location}
            options={[
                [ItemLocation.Any, '-Any-'],
                [ItemLocation.Bags, 'Bags'],
                [ItemLocation.Bank, 'Bank'],
                [ItemLocation.Reagent, 'Reagent Bank'],
                [ItemLocation.Void, 'Void Storage'],
            ]}
        />

        <button
            id="item-search-submit"
            class:state-valid={formValid}
            class:state-invalid={!formValid}
            disabled={!formValid}
        >Search!</button>
    </form>

    {#if response !== undefined}
        <div class="results-container">
            {#each response as item}
                <table class="table table-striped">
                    <thead>
                        <tr class="item-row">
                            <th class="item" colspan="3">
                                <WowthingImage name="item/{item.itemId}" size={20} border={1} />
                                {item.itemName}
                            </th>
                            <th class="count">
                                {toNiceNumber(item.characters.reduce((a, b) => a + b.count, 0))}
                            </th>
                            <th class="item-level">ILvl</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each item.characters as characterItem}
                            <tr>
                                <td class="name">
                                    <a
                                        class="quality{characterItem.quality}"
                                        href={getItemUrlSearch(item.itemId, characterItem)}
                                    >
                                        {$userStore.data.characterMap[characterItem.characterId].name}
                                    </a>
                                </td>
                                <td class="realm">
                                    &ndash; {$userStore.data.characterMap[characterItem.characterId].realm.name}
                                </td>
                                <td class="location">
                                    {ItemLocation[characterItem.location]}
                                </td>
                                <td class="count">
                                    {toNiceNumber(characterItem.count)}
                                </td>
                                <td class="item-level">
                                    {characterItem.itemLevel}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>

            {:else}
                <tr>
                    <td>No items found.</td>
                </tr>

            {/each}
        </div>
    {/if}
</div>
