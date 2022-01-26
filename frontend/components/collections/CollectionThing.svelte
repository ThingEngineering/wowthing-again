<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import find from 'lodash/find'
    import { getContext } from 'svelte'
    import type { SvelteComponent } from 'svelte'

    import { collectionState } from '@/stores/local-storage'
    import type {CollectionContext} from '@/types/contexts'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ItemLink from '@/components/links/ItemLink.svelte'
    import NpcLink from '@/components/links/NpcLink.svelte'
    import SpellLink from '@/components/links/SpellLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let things: number[] = []

    const { route, thingType, userHas } = getContext('collection') as CollectionContext

    let showAsMissing: boolean
    let userHasThing: number | undefined
    let origId: number
    let component: typeof SvelteComponent
    $: {
        userHasThing = find(
            things,
            (value: number): boolean => userHas[value] === true,
        )
        origId = userHasThing ?? things[0]

        if (userHasThing) {
            showAsMissing = $collectionState.highlightMissing[route]
        }
        else {
            showAsMissing = !$collectionState.highlightMissing[route]
        }

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
</style>

<div
    class:has-not={!userHasThing}
    class:missing={showAsMissing}
>
    <svelte:component this={component} id={origId}>
        <WowthingImage
            name="{thingType}/{origId}"
            size={40}
            border={2}
        />
    </svelte:component>

    {#if userHasThing}
        <div class="collected-icon drop-shadow">
            <IconifyIcon icon={mdiCheckboxOutline} />
        </div>
    {/if}
</div>
