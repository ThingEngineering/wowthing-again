<script lang="ts">
    import find from 'lodash/find';
    import { getContext } from 'svelte';
    import IntersectionObserver from 'svelte-intersection-observer';

    import type { CollectibleContext } from '@/types/contexts';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import type { CollectibleState } from '@/shared/state/browser.svelte';

    type Props = {
        collectibleState: CollectibleState;
        things: number[];
    };

    let { collectibleState, things }: Props = $props();

    const { countsKey, thingMapFunc, thingType, userHas } = getContext(
        'collection'
    ) as CollectibleContext;

    let element = $state<HTMLElement>(null);
    let intersected = $state(false);

    let userHasThing = $derived(find(things, (value: number): boolean => userHas.has(value)));
    let origId = $derived.by(() => {
        let id = userHasThing ?? things[0];
        if (thingMapFunc) {
            id = thingMapFunc(id);
        }
        return id;
    });
    let showAsMissing = $derived(
        userHasThing ? collectibleState.highlightMissing : !collectibleState.highlightMissing
    );
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
                <WowthingImage name="{thingType}/{origId}" size={40} border={2} />
            </WowheadLink>

            {#if userHasThing}
                <CollectedIcon />
            {/if}
        {/if}
    </div>
</IntersectionObserver>
