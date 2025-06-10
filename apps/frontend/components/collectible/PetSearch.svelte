<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { ItemQuality } from '@/enums/item-quality';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { leftPad } from '@/utils/formatting';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { UserDataPet } from '@/types';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let pets: [number, UserDataPet, string][];
    $: {
        pets = [];

        const noMaxLevel = browserState.current['collectible-pets'].searchNoMaxLevel;
        const noRare = browserState.current['collectible-pets'].searchNoRare;
        for (const [speciesId, thesePets] of getNumberKeyedEntries(userState.general.petsById)) {
            const staticPet = wowthingData.static.petById.get(speciesId);
            if (staticPet?.canBattle === false) {
                continue;
            }

            let keep = true;

            if (noMaxLevel) {
                keep = keep && !thesePets.some((pet) => pet.level === 25);
            }
            if (noRare) {
                keep = keep && !thesePets.some((pet) => pet.quality === ItemQuality.Rare);
            }

            if (keep) {
                pets.push([speciesId, bestPet(thesePets), staticPet?.name || `Pet #${speciesId}`]);
            }
        }

        pets = sortBy(pets, ([, pet, name]) =>
            [5 - pet.quality, leftPad(pet.level, 2, '0'), name].join('|')
        );
    }

    function bestPet(pets: UserDataPet[]) {
        if (pets.length === 1) {
            return pets[0];
        }

        return sortBy(pets, (pet) => [5 - pet.quality, 25 - pet.level].join('|'))[0];
    }
</script>

<style lang="scss">
    .pets {
        columns: 6;
    }
    .pet {
        --image-margin-top: -4px;
        --image-border-width: 1px;

        height: 28px;
        margin-bottom: 0.2rem;
        outline: 1px solid $border-color;
        padding: 0 0.3rem;
    }
    .level {
        white-space: nowrap;
    }
</style>

<div class="flex-column">
    <div class="options-container">
        <button>
            <Checkbox
                name="no_max_level"
                bind:value={browserState.current['collectible-pets'].searchNoMaxLevel}
                >No level 25</Checkbox
            >
        </button>
        <button>
            <Checkbox
                name="no_rare"
                bind:value={browserState.current['collectible-pets'].searchNoRare}
                >No rare quality</Checkbox
            >
        </button>
    </div>

    <div class="pets">
        {#each pets as [speciesId, pet, name] (speciesId)}
            {@const staticPet = wowthingData.static.petById.get(speciesId)}
            <div class="flex-wrapper no-break pet" data-species-id={speciesId}>
                <div class="quality{pet.quality} text-overflow">
                    {#if staticPet}
                        <WowthingImage name="npc/{staticPet.creatureId}" size={16} border={1} />
                    {/if}
                    {name}
                </div>
                <div class="level">{pet.level}</div>
            </div>
        {/each}
    </div>
    <table class="table table-striped">
        <thead>
            <tr>
                <th colspan="2">{pets.length} results</th>
            </tr>
        </thead>
        <tbody> </tbody>
    </table>
</div>
