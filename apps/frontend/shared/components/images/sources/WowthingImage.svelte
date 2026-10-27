<script lang="ts">
    import type { ImageProps } from '@/types/props';

    import Image from '../Image.svelte';

    type Props = ImageProps & {
        lazy?: boolean;
        name: string;
    };

    let { border = 0, cls, lazy = true, name, size, tooltip }: Props = $props();

    let derivedName = $derived(name === 'currency/0' ? 'item/135464' : name);
    let derivedSize = $derived(size + border * 2);
</script>

<Image
    src="https://img.wowthing.org/{size}/{derivedName}.webp"
    alt={name}
    size={derivedSize}
    {cls}
    {lazy}
    {tooltip}
/>
