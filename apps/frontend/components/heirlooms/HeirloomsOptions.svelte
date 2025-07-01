<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
</script>

<div class="options-container">
    <button>
        <CheckboxInput
            name="highlight_missing"
            bind:value={browserState.current.heirlooms.highlightMissing}
            >Highlight missing</CheckboxInput
        >
    </button>

    <span>Show:</span>

    <button>
        <CheckboxInput
            name="show_collected"
            bind:value={browserState.current.heirlooms.showCollected}>Collected</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_uncollected"
            bind:value={browserState.current.heirlooms.showUncollected}>Missing</CheckboxInput
        >
    </button>
</div>
