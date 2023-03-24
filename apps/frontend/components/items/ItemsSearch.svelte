<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import { onMount } from 'svelte'
    import { location, querystring, replace } from 'svelte-spa-router'

    import { itemSearchState, userStore } from '@/stores'
    import { ItemLocation } from '@/enums'
    import type { ItemSearchResponseItem } from '@/types/items'

    import CharacterTable from './ItemsSearchCharacterTable.svelte'
    import ItemTable from './ItemsSearchItemTable.svelte'
    import RadioGroup from '@/components/forms/RadioGroup.svelte'
    import Select from '@/components/forms/Select.svelte'
    import TextInput from '@/components/forms/TextInput.svelte'

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
                    $userStore.characterMap[char.characterId].name
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
        align-items: center;
        display: flex;
        gap: 0.5rem;
    }
    .results-container {
        column-count: 1;
        margin-top: 1rem;
        width: 29.5rem;

        @media screen and (min-width: 1350px) {
            column-count: 2;
            width: 60rem;
        }
        @media screen and (min-width: 1830px) {
            column-count: 3;
            width: 90.5rem;
        }

        :global(table) {
            --padding: 2;

            display: inline-block;
            margin-bottom: 0.5rem;
        }
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
                [ItemLocation.GuildBank, 'Guild Bank'],
            ]}
        />

        <span>group by</span>

        <RadioGroup
        bind:value={$itemSearchState.groupBy}
        name="sort_by"
        options={[
            ['character', 'Character'],
            ['item', 'Item'],
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
            {#if $itemSearchState.groupBy === 'character'}
                <CharacterTable {response} />
            {:else}
                <ItemTable {response} />
            {/if}
        </div>
    {/if}
</div>
