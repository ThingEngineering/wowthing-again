<script lang="ts">
    import { browserState } from '@/shared/state/browser';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import SidebarCollectingSettings from '@/components/common/SidebarCollectingSettings.svelte';
</script>

<style lang="scss">
    .options-container {
        align-items: start;

        :global(.collecting-settings) {
            border-radius: $border-radius;
            width: 17rem;
        }
        :global(.collecting-settings button.expand) {
            border-width: 0 !important;
        }
        :global(.collecting-settings > *:nth-child(n + 4)) {
            display: none;
        }
    }
</style>

<div class="options-container">
    <SidebarCollectingSettings />

    <button style="margin-left: 1rem">
        <Checkbox name="highlight_missing" bind:value={browserState.current.tokens.highlightMissing}
            >Highlight missing</Checkbox
        >
    </button>

    <span>Show:</span>

    <button>
        <Checkbox name="show_collected" bind:value={browserState.current.tokens.showCollected}
            >Collected</Checkbox
        >
    </button>

    <button>
        <Checkbox name="show_uncollected" bind:value={browserState.current.tokens.showUncollected}
            >Missing</Checkbox
        >
    </button>
</div>
