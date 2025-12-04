<script lang="ts">
    import Image from '@/shared/components/images/Image.svelte';
    import type { StaticDataDecorObject } from '@/shared/stores/static/types';

    let { decorObject }: { decorObject: StaticDataDecorObject } = $props();
</script>

<style lang="scss">
    div {
        --image-border: 2px;
    }
</style>

<div>
    <Image
        src="https://img.wowthing.org/decor/{decorObject.id}.webp"
        alt={decorObject.name}
        size={80}
        border={2}
    />
</div>
