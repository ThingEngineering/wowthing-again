<script lang="ts">
    import { ItemQuality } from '@/enums/item-quality';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import type { MultiSlugParams } from '@/types';

    import Collectible from './Collectible.svelte';
    import ProgressBar from '../common/ProgressBar.svelte';
    import RarityBar from '../common/RarityBar.svelte';

    let { basePath = '', params }: { basePath: string; params: MultiSlugParams } = $props();

    const thingMapFunc = (thing: number) => wowthingData.static.petById.get(thing)?.creatureId;

    let [maxLevelQuality, qualities] = $derived.by(() => {
        let countMaxLevel = 0;
        let countQualities = [0, 0, 0, 0];

        for (const pets of Object.values(userState.general.petsById)) {
            let bestQuality = 0;
            let hasMaxed = false;

            for (const pet of pets) {
                bestQuality = Math.max(bestQuality, pet.quality);
                hasMaxed ||= pet.level === 25 && pet.quality === ItemQuality.Rare;
            }

            countQualities[bestQuality]++;
            if (hasMaxed) {
                countMaxLevel++;
            }
        }

        return [countMaxLevel, countQualities];
    });
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
    sets={userState.pets.filteredCategories}
    stats={userState.pets.stats}
    thingType="npc"
    userHas={userState.general.hasPetById}
    {params}
    {thingMapFunc}
>
    <svelte:fragment slot="extra-options">
        <div class="progress">
            <ProgressBar
                title="Max level + quality"
                have={maxLevelQuality}
                total={userState.pets.stats.OVERALL.total}
            />
        </div>

        <div class="progress">
            <RarityBar {qualities} total={userState.pets.stats.OVERALL.have} />
        </div>
    </svelte:fragment>
</Collectible>
