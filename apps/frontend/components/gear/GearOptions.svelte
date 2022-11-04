<script lang="ts">
    import { gearState } from '@/stores/local-storage'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
</script>

<style lang="scss">
    button {
        background: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius;
    }
</style>

<div>
    <span>Show:</span>

    <button>
        <CheckboxInput
            name="show_max_level"
            bind:value={$gearState.showMaxLevel}
        >Max level</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_other_level"
            bind:value={$gearState.showOtherLevel}
        >Other level</CheckboxInput>
    </button>
</div>

<div>
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
            name="highlight_heirlooms"
            bind:value={$gearState.highlightHeirlooms}
        >Missing heirlooms</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="highlight_upgrades"
            bind:value={$gearState.highlightUpgrades}
        >Upgradeable</CheckboxInput>
    </button>
</div>
