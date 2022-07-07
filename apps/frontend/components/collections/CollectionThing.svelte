<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import find from 'lodash/find'
    import { getContext } from 'svelte'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { collectionState } from '@/stores/local-storage'
    import type {CollectionContext} from '@/types/contexts'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let things: number[] = []

    const { route, thingType, userHas } = getContext('collection') as CollectionContext

    let element: HTMLElement
    let intersected = false
    let origId: number
    let showAsMissing: boolean
    let userHasThing: number | undefined
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
    }
</script>

<style lang="scss">
    .collection-object {
        height: 44px;
        width: 44px;
    }
</style>

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <div
        class="collection-object"
        bind:this={element}
        class:has-not={!userHasThing}
        class:missing={showAsMissing}
    >
        {#if intersected}
            <WowheadLink type={thingType} id={origId}>
                <WowthingImage
                    name="{thingType}/{origId}"
                    size={40}
                    border={2}
                />
            </WowheadLink>

            {#if userHasThing}
                <div class="collected-icon drop-shadow">
                    <IconifyIcon icon={mdiCheckboxOutline} />
                </div>
            {/if}
        {/if}
    </div>
</IntersectionObserver>
