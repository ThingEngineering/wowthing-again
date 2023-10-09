<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import find from 'lodash/find'
    import { getContext } from 'svelte'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { collectibleState } from '@/stores/local-storage'
    import type { CollectibleContext } from '@/types/contexts'

    import IconifyIcon from '@/shared/images/IconifyIcon.svelte'
    import WowheadLink from '@/shared/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/images/sources/WowthingImage.svelte'

    export let things: number[] = []

    const { countsKey, thingMapFunc, thingType, userHas } = getContext('collection') as CollectibleContext

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

        if (thingMapFunc) {
            origId = thingMapFunc(origId)
        }

        if (userHasThing) {
            showAsMissing = $collectibleState.highlightMissing[countsKey]
        }
        else {
            showAsMissing = !$collectibleState.highlightMissing[countsKey]
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
        bind:this={element}
        class="collection-object"
        class:has-not={!userHasThing}
        class:missing={showAsMissing}
        data-id={origId}
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
