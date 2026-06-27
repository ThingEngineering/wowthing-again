<script lang="ts">
    import type { ChildrenProp } from '@/types/props';

    type Props = ChildrenProp & {
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
