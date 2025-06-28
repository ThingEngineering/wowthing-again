<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class';
    import type { UserCount } from '@/types';

    import Count from '@/components/collectible/CollectibleCount.svelte';
    import ParsedText from '../../shared/components/parsed-text/ParsedText.svelte';

    let { count, title }: { count?: UserCount; title: string } = $props();

    let percent = $derived(Math.floor(((count?.have ?? 0) / (count?.total ?? 1)) * 100));
</script>

<style lang="scss">
    div {
        align-items: center;
        background: $collection-background;
        border-bottom: 1px solid var(--border-color);
        color: #ddd;
        display: flex;
        padding: 0.25rem 0.5rem;
        width: 100%;

        &:first-child {
            border-top-left-radius: var(--border-radius);
            border-top-right-radius: var(--border-radius);
        }

        &:not(:first-child) {
            border-top: 1px solid var(--border-color);
        }
    }
    h3 {
        flex: 0 0 auto;
        margin: 0;
    }
</style>

<div>
    <h3 class={getPercentClass(percent)}>
        <ParsedText text={title} />
    </h3>
    {#if count}
        <Count counts={count} />
    {/if}
    <slot />
</div>
