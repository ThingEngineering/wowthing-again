<script lang="ts">
    import { Constants } from '@/data/constants';
    import { wowthingData } from '@/shared/stores/data';
    import { toNiceNumber } from '@/utils/formatting';
    import type {
        StaticDataReputation,
        StaticDataReputationTier,
    } from '@/shared/stores/static/types';
    import type { Character, CharacterReputationParagon } from '@/types';
    import type { ManualDataReputationSet } from '@/types/data/manual';
    import { brannHack } from './brann-hack';

    import RenownTooltip from './TooltipReputationRenown.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let bottom: string = undefined;
    export let character: Character = undefined;
    export let characterRep: number;
    export let dataRep: StaticDataReputation;
    export let paragon: CharacterReputationParagon = undefined;
    export let reputation: ManualDataReputationSet = undefined;

    const brannId = 2640;

    let reps: {
        cls: string;
        maxValue: number;
        minValue: number;
        name: string;
        thisOne: boolean;
    }[];

    $: {
        const tiers: StaticDataReputationTier =
            wowthingData.static.reputationTierById.get(dataRep.tierId) ||
            wowthingData.static.reputationTierById.get(0);

        reps = [];
        let foundIndex = -1;
        for (let i = 0; i < tiers.names.length; i++) {
            let minValue = tiers.minValues[i];
            let maxValue = tiers.minValues[i + 1] !== undefined ? tiers.minValues[i + 1] : minValue;
            if (minValue < 0 && characterRep >= maxValue) {
                continue;
            }

            const thisOne = characterRep >= minValue && (maxValue === 0 || characterRep < maxValue);
            if (thisOne) {
                foundIndex = i;
            }

            // Brann hack - only show blocks of 10 levels or (current->next multiple of 10)
            if (dataRep.id === brannId) {
                const foundBase = Math.floor((foundIndex + 1) / 10);
                const indexBase = Math.floor((i + 1) / 10);
                if (i % 10 !== 9 && (foundIndex === -1 || foundBase !== indexBase)) {
                    continue;
                } else {
                    if (foundIndex === -1 || indexBase > foundBase + 1) {
                        minValue = tiers.minValues[i - 9];
                    }
                }
            }

            reps.push({
                cls: 'quality0',
                maxValue,
                minValue,
                name: tiers.names[i],
                thisOne,
            });
        }

        // Apply quality colours to the bottom 5 tiers
        const start = Math.max(0, reps.length - 1);
        const setClass = Math.max(0, start - 5);
        let seenThisOne = false;
        let badCount = 0;
        for (let i = start; i >= 0; i--) {
            if (reps[i].maxValue <= 0) {
                reps[i].cls = ['status-shrug', 'status-warn', 'status-fail'][Math.min(2, badCount)];
                badCount++;
            } else if (dataRep.id === brannId) {
                const levelMatch = reps[i].name.match(/(\d\d)/);
                if (levelMatch) {
                    reps[i].cls = `reputation${brannHack(levelMatch[1])}`;
                }
            } else if (i >= setClass) {
                reps[i].cls = `reputation${start - i + 1}`;
            }

            if (reps[i].thisOne) {
                if (!seenThisOne) {
                    seenThisOne = true;
                } else {
                    reps[i].thisOne = false;
                }
            }
        }

        if (paragon) {
            reps.push({
                cls: 'quality6',
                maxValue: 10000,
                minValue: 0,
                name: 'Paragon',
                thisOne: false,
            });
        }
    }
</script>

<style lang="scss">
    .name {
        padding-left: 0.2rem;
        padding-right: 0.8rem;
        text-align: left;
    }
    .number1 {
        min-width: 3.5rem;
        padding-left: 0.2rem;
        text-align: right;
    }
    .number2 {
        padding-left: 0.2rem;
        text-align: right;
    }
    .separator {
        padding: 0;
    }
</style>

{#if dataRep.renownCurrencyId > 0}
    <RenownTooltip {character} {characterRep} {dataRep} {reputation} />
{:else}
    <div class="wowthing-tooltip">
        <h4>
            {#if reputation !== undefined && reputation.both === undefined}
                <WowthingImage
                    name={character.faction === 0
                        ? Constants.icons.alliance
                        : Constants.icons.horde}
                    size={20}
                />
            {/if}

            {dataRep.name}
        </h4>

        {#if character}
            <h5>{character.name}</h5>
        {/if}

        <table class="table-striped">
            <tbody>
                {#each reps as rep}
                    <tr class={rep.cls}>
                        {#if rep.name === 'Paragon'}
                            <td class="drop-shadow number1">{toNiceNumber(paragon.current)}</td>
                            <td class="separator">/</td>
                            <td class="drop-shadow number2">{toNiceNumber(paragon.max)}</td>
                        {:else if characterRep >= rep.maxValue}
                            <td class="number1" colspan="3">✔</td>
                        {:else}
                            <td class="drop-shadow number1">
                                {#if rep.thisOne}
                                    {toNiceNumber(
                                        characterRep < 0
                                            ? Math.abs(characterRep) + rep.minValue
                                            : characterRep - rep.minValue
                                    )}
                                {:else}
                                    {toNiceNumber(
                                        rep.minValue < 0 ? rep.minValue - rep.maxValue : 0
                                    )}
                                {/if}
                            </td>
                            <td class="separator">/</td>
                            <td class="drop-shadow number2">
                                {toNiceNumber(
                                    rep.minValue < 0
                                        ? rep.minValue - rep.maxValue
                                        : rep.maxValue - rep.minValue
                                )}
                            </td>
                        {/if}
                        <td class="name">{rep.name}</td>
                    </tr>
                {/each}

                {#if paragon}
                    <tr>
                        <td class="number1" colspan="4">
                            <em>{paragon.received}</em> Paragon reward{paragon.received === 1
                                ? ''
                                : 's'} received
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>

        {#if bottom}
            <div class="bottom">
                {@html bottom}
            </div>
        {/if}
    </div>
{/if}
