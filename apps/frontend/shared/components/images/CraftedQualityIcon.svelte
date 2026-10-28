<script lang="ts">
    import type { ImageProps } from '@/types/props';
    import type { MakeOptional } from '@/types/utility';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = MakeOptional<ImageProps, 'size'> & { quality: number };
    let { quality, size = 24, ...imageProps }: Props = $props();
</script>

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
