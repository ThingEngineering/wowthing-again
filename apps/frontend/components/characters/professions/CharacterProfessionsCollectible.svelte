<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let disabled = false;
    export let itemId: number;
    export let quality: number = undefined;
    export let text: string = undefined;
    export let userHas: boolean;
</script>

<style lang="scss">
    .pill {
        bottom: 0;
        pointer-events: none;
        word-spacing: -0.2ch;
    }
    .disabled {
        filter: grayscale(100%) brightness(80%) sepia(100%) hue-rotate(-50deg) saturate(300%)
            contrast(0.9);
    }
</style>

<div
    class="quality{quality || wowthingData.items.items[itemId]?.quality || 1}"
    class:disabled
    class:missing={userHas}
>
    <WowheadLink type="item" id={itemId}>
        <WowthingImage name="item/{itemId}" size={40} border={2} />
    </WowheadLink>

    {#if userHas}
        <CollectedIcon />
    {/if}

    {#if text}
        <span class="pill abs-center quality1">{text}</span>
    {/if}
</div>
