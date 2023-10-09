<script lang="ts">
    import { appearanceState } from '@/stores/local-storage'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
</script>

<div class="options-container">
    <button>
        <Checkbox
            name="highlight_missing"
            bind:value={$appearanceState.highlightMissing}
        >Highlight missing</Checkbox>
    </button>

    <span>Show:</span>

    <button>
        <Checkbox
            name="show_collected"
            bind:value={$appearanceState.showCollected}
        >Collected</Checkbox>
    </button>

    <button>
        <Checkbox
            name="show_uncollected"
            bind:value={$appearanceState.showUncollected}
        >Missing</Checkbox>
    </button>

    <span></span>

    <button class="quality0">
        <Checkbox
            name="show_quality0"
            bind:value={$appearanceState.showQuality0}
        >Poor</Checkbox>
    </button>
    <button class="quality1">
        <Checkbox
            name="show_quality1"
            bind:value={$appearanceState.showQuality1}
        >Common</Checkbox>
    </button>
    <button class="quality2">
        <Checkbox
            name="show_quality2"
            bind:value={$appearanceState.showQuality2}
        >Uncommon</Checkbox>
    </button>
    <button class="quality3">
        <Checkbox
            name="show_quality3"
            bind:value={$appearanceState.showQuality3}
        >Rare</Checkbox>
    </button>
    <button class="quality4">
        <Checkbox
            name="show_quality4"
            bind:value={$appearanceState.showQuality4}
        >Epic</Checkbox>
    </button>
    <button class="quality5">
        <Checkbox
            name="show_quality5"
            bind:value={$appearanceState.showQuality5}
        >Legendary</Checkbox>
    </button>
    <button class="quality6">
        <Checkbox
            name="show_quality6"
            bind:value={$appearanceState.showQuality6}
        >Artifact</Checkbox>
    </button>
    <button class="quality7">
        <Checkbox
            name="show_quality7"
            bind:value={$appearanceState.showQuality7}
        >Heirloom</Checkbox>
    </button>
</div>
