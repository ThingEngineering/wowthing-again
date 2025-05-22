<script lang="ts">
    import { StatType } from '@/enums/stat-type'
    import type { Character } from '@/types/character'

    import Basic from './stats/CharactersPaperdollStatsBasic.svelte'
    import Misc from './stats/CharactersPaperdollStatsMisc.svelte'
    import Rating from './stats/CharactersPaperdollStatsRating.svelte'

    export let character: Character

    let mainStat: StatType
    $: {
        mainStat = 0
        if (!character.statistics) {
            break $
        }

        let maxValue = 0
        for (const testType of [StatType.Agility, StatType.Intellect, StatType.Strength]) {
            const testValue = character.statistics.basic[testType]?.effective ?? 0
            if (testValue > maxValue) {
                maxValue = testValue
                mainStat = testType
            }
        }
    }
</script>

<style lang="scss">
    .stats {
        display: flex;
        flex-direction: column;
        // gap: 1rem;
        position: absolute;
        right: -1rem;
        top: 0;
        transform: translateX(100%);
        width: 12rem;
    }
    .stats-block {
        &:first-child {
            border-top: 1px solid $border-color;
        }

        + .stats-block {
            border-top-width: 0;
        }
    }
    h3 {
        border-bottom: 1px solid $border-color;
        border-left: 1px solid $border-color;
        border-right: 1px solid $border-color;
        padding: 0.2rem 0;
        text-align: center;
    }
    table {
        width: 100%;

        :global(td) {
            padding: 0.2rem 0.4rem;
        }

        :global(td:last-child) {
            line-height: 1.4;
            text-align: right;
            word-spacing: -0.2ch;
        }
    }
    .item-level {
        background: #212324;
        border-bottom: 1px solid $border-color;
        border-left: 1px solid $border-color;
        border-right: 1px solid $border-color;
        font-size: 125%;
        padding: 0.3rem 0.5rem;
        text-align: center;
    }
</style>

{#if character.statistics}
    <div class="stats">
        <div class="stats-block">
            <h3>Item Level</h3>
            <div class="item-level quality{character.calculatedItemLevelQuality}">
                {character.calculatedItemLevel}
            </div>
        </div>

        <div class="stats-block">
            <h3>Base</h3>
            
            <table class="table table-striped">
                <tbody>
                    <Misc type={StatType.Health} {character} />
                    <Basic type={StatType.Stamina} {character} />
                    <Basic type={mainStat} {character} />
                    <Rating label="Speed" type={StatType.SpeedRating} {character} />
                </tbody>
            </table>
        </div>
        
        <div class="stats-block">
            <h3>Ratings</h3>

            <table class="table table-striped">
                <tbody>
                    <Rating label="Crit" type={StatType.CritMeleeRating} {character} />
                    <Rating label="Haste" type={StatType.HasteMeleeRating} {character} />
                    <Rating label="Mastery" type={StatType.MasteryRating} {character} />
                    <Rating label="Versatility" type={StatType.VersatilityDamageDone} {character} />
                </tbody>
            </table>
        </div>

        <div class="stats-block">
            <h3>Defense</h3>

            <table class="table table-striped">
                <tbody>
                    <Rating label="Dodge" type={StatType.DodgeRating} {character} />
                    <Rating label="Parry" type={StatType.ParryRating} {character} />
                    <Rating label="Avoidance" type={StatType.AvoidanceRating} {character} />
                    <Rating label="Leech" type={StatType.LifestealRating} {character} />
                    <Rating label="Versatility" type={StatType.VersatilityDamageTaken} {character} />
                </tbody>
            </table>
        </div>
    </div>
{/if}
