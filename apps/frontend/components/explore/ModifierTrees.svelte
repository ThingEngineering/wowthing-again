<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';

    import NumberInput from '@/shared/components/forms/NumberInput.svelte';

    // meow
</script>

<style lang="scss">
</style>

<div class="thing-container border">
    <NumberInput
        name="modifier_tree_id"
        minValue={0}
        maxValue={999999}
        bind:value={browserState.current.explore.modifierTreeId}
    />
</div>
