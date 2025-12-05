<script lang="ts">
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Image from '@/shared/components/images/Image.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import { iconLibrary } from '@/shared/icons';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import type { StaticDataDecorObject } from '@/shared/stores/static/types';
    import { userState } from '@/user-home/state/user';

    let { decorObject }: { decorObject: StaticDataDecorObject } = $props();

    let decorItem = $derived(wowthingData.items.items[decorObject.itemId]);
    let quality = $derived(decorItem?.quality || 1);
    let counts = $derived(userState.general.decor?.[decorObject.id] || [0, 0]);
    let total = $derived(counts.reduce((a, b) => a + b, 0));

    let decorSettings = $derived(browserState.current.decor);
    let show = $derived(
        (total > 0 && decorSettings.showCollected) || (total === 0 && decorSettings.showUncollected)
    );
</script>

<style lang="scss">
    .object {
        --image-border: 2px;
    }
    .has-counts {
        :global(img) {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom-width: 1px;
        }
    }
    .counts {
        --image-margin-top: -4px;
        --scale: 0.7;

        border: 1px solid var(--image-border-color);
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        border-width: 0 2px 2px 2px;
        padding-right: 0.2rem;
        word-spacing: -0.4ch;
    }
</style>

{#if show}
    <div
        class="object quality{quality}"
        class:missing={decorSettings.highlightMissing ? total > 0 : total === 0}
        class:has-counts={total > 0}
    >
        <WowheadLink type="item" id={decorObject.itemId}>
            <Image
                src="https://img.wowthing.org/decor/{decorObject.id}.webp"
                alt={decorObject.name}
                size={80}
                border={2}
            />
        </WowheadLink>

        {#if total > 0}
            <div class="counts flex-wrapper quality{quality}-border">
                <span class="stored quality1">
                    <IconifyIcon icon={iconLibrary.gameOpenChest} />
                    {counts[0]}
                </span>
                <span class="placed quality1">
                    <IconifyIcon icon={iconLibrary.gameHouse} />
                    {counts[1]}
                </span>
            </div>
        {/if}
    </div>
{/if}
