<script lang="ts">
    import type { UserCount } from '@/types';
    import type { ChildrenProp } from '@/types/props';

    type Props = ChildrenProp & {
        counts: UserCount;
        marginLeft?: string;
        noEm?: boolean;
    };
    let { children, counts, marginLeft, noEm }: Props = $props();

    let have = $derived(counts?.have ?? '??');
    let total = $derived(counts?.total ?? '??');
    let percent = $derived(counts?.percent || 0);
    let quality = $derived(Math.floor(percent / 25) + 1);
</script>

<style lang="scss">
    .collectible-count {
        flex: 0 0 auto;
        font-size: 90%;
        font-weight: normal;
        word-spacing: -0.2ch;
    }
</style>

<span class="collectible-count" style:margin-left={marginLeft || '0.5rem'}>
    {#if noEm}
        <span class="quality{quality}">{have}</span> /
        <span class="quality{quality}">{total}</span>
    {:else}
        <em class="quality{quality}">{have}</em> /
        <em class="quality{quality}">{total}</em>
    {/if}

    {@render children?.()}
</span>
