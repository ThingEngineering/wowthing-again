<script lang="ts">
    import { bagSlots } from '@/data/bag-slots';
    import { ItemLocation } from '@/enums/item-location';
    import { wowthingData } from '@/shared/stores/data';
    import type { Character } from '@/types';
    import type { UserItem } from '@/types/shared';

    import Empty from '@/components/items/ItemsEmpty.svelte';
    import Item from '@/components/items/ItemsItem.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let character: Character;
    export let location: ItemLocation;

    let containers: {
        bagId: number;
        id: number;
        name: string;
        slots: number;
        items: UserItem[];
    }[];
    $: {
        const temp: Record<number, UserItem[]> = {};
        for (const item of character.itemsByLocation[location]) {
            (temp[item.containerId] ||= []).push(item);
        }

        if (location === ItemLocation.Bank) {
            for (const item of character.itemsByLocation[ItemLocation.Reagent]) {
                (temp[item.containerId] ||= []).push(item);
            }
        }

        containers = [];
        for (const [containerId, containerName, containerSlots] of bagSlots[location]) {
            const actualSlots =
                containerSlots ||
                wowthingData.static.bagById.get(character.bags[containerId])?.slots ||
                0;
            const items = temp[containerId] || [];
            items.sort((a, b) => a.slot - b.slot);

            const newItems: UserItem[] = [];
            for (let i = 0; i < actualSlots; i++) {
                const item = items.filter((item) => item.slot === i + 1)[0];
                newItems.push(item);
            }

            containers.push({
                id: containerId,
                name: containerName,
                bagId: character.bags[containerId] || 0,
                slots: actualSlots,
                items: newItems,
            });
        }
    }
</script>

<style lang="scss">
    .collection-objects {
        --item-empty-border: var(--border-color);

        gap: 0.04rem;
    }
    .slot-count {
        color: oklch(from var(--color-body-text) calc(l - 0.15) c h);
        font-size: 90%;
        margin-left: 0.2rem;
        word-spacing: -0.2ch;
    }
    .bag-name {
        --image-border-color: var(--border-color);
        --image-margin-top: -4px;

        font-size: 90%;
        margin-left: 0.2rem;
    }
    h4 {
        &:not(:first-child) {
            margin-top: 1rem;
        }
    }
</style>

<div class="collection-v2-section">
    <div class="collection-v2-group">
        {#each containers as container (container)}
            <h4>
                {container.name}
                <span class="slot-count">
                    ( {container.items.filter((i) => !!i).length} / {container.slots} )
                </span>
                {#if container.bagId}
                    <span class="bag-name">
                        <WowheadLink id={container.bagId} type="item">
                            <WowthingImage name={`item/${container.bagId}`} size={16} border={1} />
                            <ParsedText text={`{item:${container.bagId}}`} />
                        </WowheadLink>
                    </span>
                {/if}
            </h4>
            <div class="collection-objects">
                {#if container.slots > 0}
                    {#each container.items as item}
                        {#if item}
                            <Item gear={{ equipped: item }} useItemCount={true} />
                        {:else}
                            <Empty />
                        {/if}
                    {/each}
                {/if}
            </div>
        {/each}
    </div>
</div>
