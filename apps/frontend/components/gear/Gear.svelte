<script lang="ts">
    import { afterUpdate } from 'svelte'
    import { location, querystring, replace } from 'svelte-spa-router'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './GearTableRowItems.svelte'

    afterUpdate(() => {
        window.__tip?.watchElligibleElements()
    })

    let highlightMissingEnchants: boolean
    let highlightMissingGems: boolean

    $: {
        // Parse query string
        const parsed = new URLSearchParams($querystring)
        highlightMissingEnchants = parsed.get('missingEnchants') === 'true'
        highlightMissingGems = parsed.get('missingGems') === 'true'
    }

    $: {
        // Update query string
        const queryParts = []
        if (highlightMissingEnchants) {
            queryParts.push('missingEnchants=true')
        }
        if (highlightMissingGems) {
            queryParts.push('missingGems=true')
        }

        const qs = queryParts.join('&')
        if (qs !== $querystring) {
            replace($location + (qs ? '?' + qs : ''))
        }
    }
</script>

<style lang="scss">
    button {
        background: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius;
    }
    div {
        margin-bottom: 1rem;
    }
</style>

<CharacterTable>
    <div slot="preTable">
        <button>
            <CheckboxInput
                name="highlight_enchants"
                bind:value={highlightMissingEnchants}
            >Highlight missing enchants</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="highlight_gems"
                bind:value={highlightMissingGems}
            >Highlight missing gems</CheckboxInput>
        </button>
    </div>

    <svelte:fragment slot="rowExtra" let:character>
        <RowItemLevel />
        
        <RowItems
            bind:highlightMissingEnchants
            bind:highlightMissingGems
            {character}
        />
    </svelte:fragment>
</CharacterTable>
