<script lang="ts">
    import { collectibleState } from '@/stores/local-storage'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
</script>

<div class="options-container">
    <button>
        <Checkbox
            name="highlight_missing"
            bind:value={$collectibleState.highlightMissing['customizations']}
        >Highlight missing</Checkbox>
    </button>

    <span>Show:</span>

    <button>
        <Checkbox
            name="show_collected"
            bind:value={$collectibleState.showCollected['customizations']}
        >Collected</Checkbox>
    </button>

    <button>
        <Checkbox
            name="show_uncollected"
            bind:value={$collectibleState.showUncollected['customizations']}
        >Missing</Checkbox>
    </button>
</div>
