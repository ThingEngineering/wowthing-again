<script lang="ts">
    import find from 'lodash/find';
    import maxBy from 'lodash/maxBy';
    import { getContext } from 'svelte';
    import IntersectionObserver from 'svelte-intersection-observer';

    import { petBreedMap } from '@/data/pet-breed';
    import { userState } from '@/user-home/state/user';
    import type { CollectibleState } from '@/shared/state/browser.svelte';
    import type { CollectibleContext } from '@/types/contexts';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import NpcLink from '@/shared/components/links/NpcLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        collectibleState: CollectibleState;
        things: number[];
    };

    let { collectibleState, things }: Props = $props();

    const { thingMapFunc } = getContext('collection') as CollectibleContext;

    let element = $state<HTMLElement>(null);
    let intersected = $state(false);

    let userHasThing = $derived(find(things, (petId) => userState.general.hasPetById.has(petId)));
    let origId = $derived(userHasThing ?? things[0]);
    let pets = $derived(userHasThing ? userState.general.petsById[origId] : []);
    let quality = $derived(maxBy(pets, (pet) => pet.quality)?.quality || 2);
    let showAsMissing = $derived(
        userHasThing ? collectibleState.highlightMissing : !collectibleState.highlightMissing
    );
</script>

<style lang="scss">
    .collection-object {
        height: 44px;
        width: 44px;
    }
    .pet {
        display: flex;
        font-family: monospace;
        font-size: 0.85rem;
        justify-content: space-between;
        line-height: 1.2;
        padding: 1px 1px 0 1px;
    }
</style>

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <div
        bind:this={element}
        class="collection-object {userHasThing ? `quality${quality}` : 'has-not'}"
        class:missing={showAsMissing}
        style:height={pets.length > 0 ? `${44 + 18 * pets.length}px` : null}
        data-id={origId}
    >
        {#if intersected}
            {@const creatureId = thingMapFunc(origId)}
            <NpcLink id={creatureId}>
                <WowthingImage name="npc/{creatureId}" size={40} border={2} />
            </NpcLink>

            {#each pets as pet}
                <div class="pet quality{pet.quality}">
                    <span>{petBreedMap[pet.breedId]}</span>
                    <span>{pet.level}</span>
                </div>

                {#if userHasThing}
                    <CollectedIcon />
                {/if}
            {/each}
        {/if}
    </div>
</IntersectionObserver>
