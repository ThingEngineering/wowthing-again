<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
</script>

<div class="options-container">
    <button>
        <Checkbox
            name="highlight_missing"
            bind:value={browserState.current['collectible-customizations'].highlightMissing}
            >Highlight missing</Checkbox
        >
    </button>

    <span>Show:</span>

    <button>
        <Checkbox
            name="show_collected"
            bind:value={browserState.current['collectible-customizations'].showCollected}
            >Collected</Checkbox
        >
    </button>

    <button>
        <Checkbox
            name="show_uncollected"
            bind:value={browserState.current['collectible-customizations'].showUncollected}
            >Missing</Checkbox
        >
    </button>
</div>
