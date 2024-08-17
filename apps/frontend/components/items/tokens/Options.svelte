<script lang="ts">
    import { browserStore } from '@/shared/stores/browser';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
</script>

<div class="options-container">
    <button>
        <Checkbox
            name="highlight_missing"
            bind:value={$browserStore.tokens.highlightMissing}
        >Highlight missing</Checkbox>
    </button>

    <span>Show:</span>

    <button>
        <Checkbox
            name="show_collected"
            bind:value={$browserStore.tokens.showCollected}
        >Collected</Checkbox>
    </button>

    <button>
        <Checkbox
            name="show_uncollected"
            bind:value={$browserStore.tokens.showUncollected}
        >Missing</Checkbox>
    </button>
</div>
