<script lang="ts">
    import type { Component } from 'svelte';
    import type { SvelteHTMLElements } from 'svelte/elements';

    type Props = {
        Icon: Component<SvelteHTMLElements['svg']>;
        cls?: string;
        scale?: string;
    };
    let { Icon, cls, scale }: Props = $props();
</script>

<style lang="scss">
    span {
        :global(svg) {
            margin-top: var(--image-margin-top, 0);
            transform: scale(var(--scale, 1));
        }
    }
</style>

<span class={cls} style:--scale={scale}>
    <Icon />
</span>
