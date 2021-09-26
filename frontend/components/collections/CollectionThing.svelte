<script lang="ts">
    import find from 'lodash/find'
    import { getContext } from 'svelte'
    import type { SvelteComponent } from 'svelte'

    import type {CollectionContext} from '@/types/contexts'

    import ItemLink from '@/components/links/ItemLink.svelte'
    import NpcLink from '@/components/links/NpcLink.svelte'
    import SpellLink from '@/components/links/SpellLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let things: number[] = []

    const { thingMap, thingType, userHas } = getContext('collection') as CollectionContext

    let userHasThing: number | undefined
    let origId: number
    let component: typeof SvelteComponent
    $: {
        userHasThing = find(
            things,
            (value: number): boolean =>
                userHas[thingMap[value] || -1] !== undefined,
        )
        origId = userHasThing ?? things[0]

        if (thingType === 'item') {
            component = ItemLink
        }
        else if (thingType === 'npc') {
            component = NpcLink
        }
        else if (thingType === 'spell') {
            component = SpellLink
        }
    }
</script>

<style lang="scss">
    div {
        border-radius: $border-radius;
        display: inline-block;

        &.thing-yes {
            border: 2px solid #44aa44;
        }
        &.thing-no {
            border: 2px solid $border-color;
            opacity: 0.5;
        }
    }
    div:not(:first-of-type) {
        margin-left: 3px;
    }
</style>

<div class:thing-yes={userHasThing} class:thing-no={!userHasThing}>
    <svelte:component this={component} id={origId}>
        <WowthingImage name="{thingType}/{origId}" size={40} />
    </svelte:component>
</div>
