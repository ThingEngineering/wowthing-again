<script lang="ts">
    import type { ImageProps } from '@/types/props';
    import type { MakeOptional } from '@/types/utility';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = MakeOptional<ImageProps, 'size'> & { quality: number };
    let { quality, size = 24, ...imageProps }: Props = $props();
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
        {size}
        --image-border-width={0}
        {...imageProps}
    />
{/if}
