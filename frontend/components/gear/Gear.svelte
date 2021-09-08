<script lang="ts">
    import { afterUpdate } from 'svelte'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './TableRowItems.svelte'

    afterUpdate(() => {
        window.__tip?.watchElligibleElements()
    })

    let highlightMissingEnchants = false
    let highlightMissingGems = false
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
                label="Highlight missing enchants"
                bind:value={highlightMissingEnchants}
            />
        </button>

        <button>
            <CheckboxInput
                name="highlight_gems"
                label="Highlight missing gems"
                bind:value={highlightMissingGems}
            />
        </button>
    </div>

    <svelte:fragment slot="rowExtra" let:character>
        <RowItemLevel />
        <RowItems {character} bind:highlightMissingEnchants bind:highlightMissingGems />
    </svelte:fragment>
</CharacterTable>
