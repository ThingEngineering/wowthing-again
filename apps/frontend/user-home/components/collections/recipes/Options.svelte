<script lang="ts">
    import { recipesState } from './state'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
</script>

<div class="options-container">
    <button>
        <Checkbox
            name="highlight_missing"
            bind:value={$recipesState.highlightMissing}
        >Highlight missing</Checkbox>
    </button>

    <span>Show:</span>

    <button>
        <Checkbox
            name="show_collected"
            bind:value={$recipesState.showCollected}
        >Collected</Checkbox>
    </button>

    <button>
        <Checkbox
            name="show_uncollected"
            bind:value={$recipesState.showUncollected}
        >Missing</Checkbox>
    </button>
</div>
