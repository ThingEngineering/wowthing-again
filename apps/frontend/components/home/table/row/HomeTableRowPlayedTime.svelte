<script lang="ts">
    import { toNiceDuration } from '@/utils/formatting';

    let { playedTotal }: { playedTotal: number } = $props();

    let played = $derived(toNiceDuration(playedTotal * 1000));
</script>

<style lang="scss">
    td {
        @include cell-width($width-played, $maxWidth: $width-played-max);

        border-left: 1px solid var(--border-color);
        text-align: right;
    }
    code {
        background: none;
    }
</style>

<td>
    <code>{@html played}</code>
</td>
