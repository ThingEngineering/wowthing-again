<script lang="ts">
    import type { ChildrenProp } from '@/types/props';

    type Props = ChildrenProp & {
        cls?: string;
        disabled?: boolean;
        onclick?: (e: Event) => void;
    };
    let { children, cls, disabled, onclick }: Props = $props();
</script>

<style lang="scss">
    button {
        background: var(--button-background);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        cursor: pointer;
        display: block;

        &:disabled {
            cursor: inherit;
            opacity: 0.7;
        }
    }
</style>

<button class={cls} {disabled} {onclick}>
    {@render children?.()}
</button>
