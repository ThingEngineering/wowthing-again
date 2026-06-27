<script lang="ts">
    import type { Snippet } from 'svelte';

    type Props = {
        children: Snippet;
        padLeft?: string;
        padRight?: string;
    };
    let { children, padLeft, padRight }: Props = $props();
</script>

<style lang="scss">
    td {
        --width: var(--width-icon);

        text-align: center;
    }
</style>

<td style:--padding-left={padLeft} style:--padding-right={padRight}>
    {@render children?.()}
</td>
