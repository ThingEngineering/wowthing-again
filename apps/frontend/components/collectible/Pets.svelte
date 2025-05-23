<script lang="ts">
    import { lazyStore, userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import type { MultiSlugParams } from '@/types'

    import Collectible from './Collectible.svelte'
    import ProgressBar from '../common/ProgressBar.svelte';
    import { ItemQuality } from '@/enums/item-quality';
    import RarityBar from '../common/RarityBar.svelte';

    export let basePath = ''
    export let params: MultiSlugParams

    const thingMapFunc = (thing: number) => $staticStore.pets[thing]?.creatureId

    let maxLevelQuality: number
    let qualities: number[]
    $: {
        maxLevelQuality = 0;
        qualities = [0, 0, 0, 0];

        for (const pets of Object.values($userStore.pets)) {
            let bestQuality = 0;
            let hasMaxed = false;

            for (const pet of pets) {
                bestQuality = Math.max(bestQuality, pet.quality);
                hasMaxed ||= (pet.level === 25 && pet.quality === ItemQuality.Rare);
            }

            qualities[bestQuality]++;
            if (hasMaxed) {
                maxLevelQuality++;
            }
        }
    }
</script>

<style lang="scss">
    .progress {
        --bar-height: 1.7rem;

        margin-left: 1rem;
        width: 16rem;
    }
</style>

<Collectible
    route={basePath ? `${basePath}/pets` : 'pets'}
    sets={$lazyStore.pets.filteredCategories}
    thingType="npc"
    userHas={$userStore.hasPet}
    {params}
    {thingMapFunc}
>
    <svelte:fragment slot="extra-options">
        <div class="progress">
            <ProgressBar
                title="Max level + quality"
                have={maxLevelQuality}
                total={$lazyStore.pets.stats.OVERALL.total}
            />
        </div>

        <div class="progress">
            <RarityBar
                {qualities}
                total={$lazyStore.pets.stats.OVERALL.have}
            />
        </div>
    </svelte:fragment>
</Collectible>
