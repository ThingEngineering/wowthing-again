<script lang="ts">
    import { collectibleState } from '@/stores/local-storage'

    import Checkbox from '@/shared/forms/CheckboxInput.svelte'
</script>

<div class="options-container">
    <button>
        <Checkbox
            name="highlight_missing"
            bind:value={$collectibleState.highlightMissing['dragonriding']}
        >Highlight missing</Checkbox>
    </button>

    <span>Show:</span>

    <button>
        <Checkbox
            name="show_collected"
            bind:value={$collectibleState.showCollected['dragonriding']}
        >Collected</Checkbox>
    </button>

    <button>
        <Checkbox
            name="show_uncollected"
            bind:value={$collectibleState.showUncollected['dragonriding']}
        >Missing</Checkbox>
    </button>
</div>
