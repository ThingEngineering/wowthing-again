<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { staticStore } from '@/shared/stores/static';
    import { userStore } from '@/stores';
    import { leftPad } from '@/utils/formatting';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import { collectibleState } from '@/stores/local-storage';
    import type { UserDataPet } from '@/types';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let pets: [number, UserDataPet, string][];
    $: {
        pets = [];
        const noMaxLevel = $collectibleState.petSearchNoMaxLevel;
        for (const [speciesId, thesePets] of getNumberKeyedEntries($userStore.pets)) {
            const staticPet = $staticStore.pets[speciesId];
            if (staticPet?.canBattle === false) {
                continue;
            }

            if (noMaxLevel) {
                if (!thesePets.some((pet) => pet.level === 25)) {
                    pets.push([
                        speciesId,
                        bestPet(thesePets),
                        $staticStore.pets[speciesId]?.name || `Pet #${speciesId}`,
                    ]);
                }
            }
        }

        pets = sortBy(pets, ([speciesId, pet, name]) =>
            [5 - pet.quality, leftPad(pet.level, 2, '0'), name].join('|'),
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
</style>

<div class="flex-column">
    <div class="options-container">
        <button>
            <Checkbox name="highlight_missing" bind:value={$collectibleState.petSearchNoMaxLevel}
                >With no level 25</Checkbox
            >
        </button>
    </div>

    <div class="pets">
        {#each pets as [speciesId, pet, name]}
            {@const staticPet = $staticStore.pets[speciesId]}
            <div class="flex-wrapper no-break pet" data-species-id={speciesId}>
                <div class="quality{pet.quality}">
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
