<script lang="ts">
    import { gearState } from '@/stores/local-storage'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './GearTableRowItems.svelte'
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
        <span>Highlight:</span>

        <button>
            <CheckboxInput
                name="highlight_enchants"
                bind:value={$gearState.highlightEnchants}
            >Missing enchants</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="highlight_gems"
                bind:value={$gearState.highlightGems}
            >Missing gems</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="highlight_upgrades"
                bind:value={$gearState.highlightUpgrades}
            >Upgradeable</CheckboxInput>
        </button>
    </div>

    <svelte:fragment slot="rowExtra" let:character>
        <RowItemLevel />
        <RowItems {character} />
    </svelte:fragment>
</CharacterTable>
