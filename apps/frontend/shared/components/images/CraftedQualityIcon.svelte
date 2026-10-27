<script lang="ts">
    import type { ImageProps } from '@/types/props';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = ImageProps & { quality: number };
    let { quality, ...imageProps }: Props = $props();
</script>

<style lang="scss">
    .crafted-quality-2,
    .crafted-quality-13 {
        scale: 1.3;
    }
    .crafted-quality-4 {
        scale: 0.8;
    }
    .crafted-quality-5 {
        scale: 0.7;
    }
</style>

{#if quality > 0}
    <WowthingImage
        cls="drop-shadow crafting-quality-{quality}"
        name="crafting_quality_{quality}"
        border={0}
        size={24}
        --image-border-width={0}
        {...imageProps}
    />
{/if}
