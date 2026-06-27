<script lang="ts">
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
</script>

<style lang="scss">
    .under-construction {
        font-weight: 600;
        padding: 0.75rem;
    }
</style>

<div class="under-construction thing-container bg-fail border">
    {#if children}
        {@render children()}
    {:else}
        This area is under construction and probably doesn't work very well, please be patient!
    {/if}
</div>
