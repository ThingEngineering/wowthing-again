<script lang="ts">
    import { bagSlots } from '@/data/bag-slots'
    import { ItemLocation } from '@/enums/item-location'
    import { staticStore } from '@/shared/stores/static'
    import type { Character } from '@/types'
    import type { UserItem } from '@/types/shared'

    import Empty from '@/components/items/ItemsEmpty.svelte'
    import Item from '@/components/items/ItemsItem.svelte'

    export let character: Character
    export let location: ItemLocation

    let containers: {
        id: number,
        name: string,
        slots: number,
        items: UserItem[]
    }[]
    $: {
        const temp: Record<number, UserItem[]> = {}
        for (const item of (character.itemsByLocation[location] || [])) {
            (temp[item.containerId] ||= []).push(item);
        }

        containers = []
        for (const [containerId, containerName, containerSlots] of bagSlots[location]) {
            const actualSlots = containerSlots
                || $staticStore.bags[character.bags[containerId]]?.slots || 0
            const items = temp[containerId] || []
            items.sort((a, b) => a.slot - b.slot)

            const newItems: UserItem[] = []
            for (let i = 0; i < actualSlots; i++) {
                const item = items.filter((item) => item.slot === i + 1)[0]
                newItems.push(item)
            }

            containers.push({
                id: containerId,
                name: containerName,
                slots: actualSlots,
                items: newItems,
            })
        }

        console.log(containers)
    }
</script>

<style lang="scss">
    .collection-objects {
        gap: 0.1rem;
    }
    h4 {
        margin-top: 0.5rem;
    }
</style>

<div class="collection-v2-section">
    <div>
        <h4>{ItemLocation[location]}</h4>
    </div>
    
    <div class="collection-v2-group">
        {#each containers as container}
            <h4>{container.name}</h4>
            <div class="collection-objects">
                {#if container.slots > 0}
                    {#each container.items as item}
                        {#if item}
                            <Item gear={{equipped: item}} />
                        {:else}
                            <Empty />
                        {/if}
                    {/each}
                {/if}
            </div>
        {/each}
    </div>
</div>
