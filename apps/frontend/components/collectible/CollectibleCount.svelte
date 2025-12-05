<script lang="ts">
    import type { Snippet } from 'svelte';

    import type { UserCount } from '@/types';

    let { children, counts }: { children?: Snippet; counts: UserCount } = $props();

    let have = $derived(counts?.have ?? '??');
    let total = $derived(counts?.total ?? '??');
    let percent = $derived(counts?.percent || 0);
</script>

<style lang="scss">
    span {
        flex: 0 0 auto;
        font-size: 90%;
        font-weight: normal;
        margin-left: 0.5rem;
        word-spacing: -0.2ch;
    }
</style>

<span class="collectible-count">
    <em class="quality{Math.floor(percent / 25) + 1}">{have}</em> /
    <em class="quality{Math.floor(percent / 25) + 1}">{total}</em>
    {@render children?.()}
</span>
