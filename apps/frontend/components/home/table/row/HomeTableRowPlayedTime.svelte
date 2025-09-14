<script lang="ts">
    import { toNiceDuration } from '@/utils/formatting';

    let { playedTotal }: { playedTotal: number } = $props();

    let played = $derived(toNiceDuration(playedTotal * 1000));
</script>

<style lang="scss">
    td {
        --max-width: 8rem;
        --width: 5.2rem;

        border-left: 1px solid var(--border-color);
        text-align: right;
    }
    code {
        background: none;
    }
</style>

<td class="max-width">
    <code>{@html played}</code>
</td>
