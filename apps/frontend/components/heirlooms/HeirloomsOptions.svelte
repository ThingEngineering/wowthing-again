<script lang="ts">
    import { heirloomState } from '@/stores/local-storage'

    import CheckboxInput from '@/shared/forms/CheckboxInput.svelte'
</script>

<div class="options-container">
    <button>
        <CheckboxInput
            name="highlight_missing"
            bind:value={$heirloomState.highlightMissing}
        >Highlight missing</CheckboxInput>
    </button>

    <span>Show:</span>

    <button>
        <CheckboxInput
            name="show_collected"
            bind:value={$heirloomState.showCollected}
        >Collected</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_uncollected"
            bind:value={$heirloomState.showUncollected}
        >Missing</CheckboxInput>
    </button>
</div>
