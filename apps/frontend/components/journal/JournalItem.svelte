<script lang="ts">
    import { getDifficulties } from './get-difficulties';
    import { Faction } from '@/enums/faction'
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class'
    import { RewardType } from '@/enums/reward-type';
    import { staticStore } from '@/shared/stores/static';
    import { itemStore, userStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import { getItemUrl } from '@/utils/get-item-url'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { JournalDataEncounterItem, JournalDataEncounterItemAppearance, JournalDataInstance } from '@/types/data/journal'

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte'
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let bonusIds: Record<number, number> = undefined
    export let instance: JournalDataInstance
    export let item: JournalDataEncounterItem

    $: classId = item.classMask in PlayableClassMask
        ? PlayableClass[PlayableClassMask[item.classMask] as keyof typeof PlayableClass]
        : 0
    $: dataItem = $itemStore.items[item.id]

    const getQuality = function(appearance: JournalDataEncounterItemAppearance): number {
        // Mythic Keystone/Mythic difficulties should probably set the quality to epic?
        for (const difficulty of appearance.difficulties) {
            if (difficulty === 23) {
                return 4
            }
        }
        return item.quality
    }

    const getBonusIds = function(appearance: JournalDataEncounterItemAppearance): number[] {
        if (bonusIds === undefined || appearance.difficulties?.length > 1) {
            return []
        }

        const bonusId = bonusIds[appearance.difficulties[0]]
        return bonusId ? [bonusId] : []
    }
</script>

<style lang="scss">
    .journal-item {
        min-height: 52px;
        width: 52px;

        :global(a > img) {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

        }
    }
    .player-class {
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        left: 0;
        position: absolute;
        top: -2px;
        width: 24px;
    }
    .player-faction {
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        left: 0;
        position: absolute;
        top: 26px;
        width: 24px;
    }
    .collected-appearances {
        border-bottom-left-radius: 0;
        border-bottom-width: 0 !important;
        border-top-right-radius: 0;
        color: $color-success;
        font-size: 95%;
        line-height: 1;
        padding: 0.1rem 0.2rem;
        pointer-events: none;
        position: absolute;
        top: 31px;
        right: 1px;
    }
    .difficulties {
        background-color: $highlight-background;
        border: 1px solid;
        border-radius: $border-radius-small;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        line-height: 1;
        margin-top: -1px;
        padding: 0 2px 1px 2px;
        text-align: center;
        white-space: nowrap;
    }
</style>

{#each item.appearances as appearance}
    {#if
        ($journalState.showCollected && appearance.userHas) ||
        ($journalState.showUncollected && !appearance.userHas)
    }
        {@const [diffShort, diffLong] = getDifficulties(instance, appearance)}
        <div
            class="journal-item quality{getQuality(appearance)}"
            class:missing={
                (!$journalState.highlightMissing && !appearance.userHas) ||
                ($journalState.highlightMissing && appearance.userHas)
            }
        >
            <a href="{getItemUrl({
                itemId: item.id,
                bonusIds: getBonusIds(appearance),
            })}">
                <WowthingImage
                    name="item/{item.id}{appearance.modifierId > 0 ? `_${appearance.modifierId}` : ''}"
                    size={48}
                    border={2}
                />
            </a>

            {#if classId > 0}
                {@const hasSoon = !appearance.userHas && $userStore.itemsByAppearanceSource[`${item.id}_${appearance.modifierId}`]}
                <div class="player-class class-{classId} drop-shadow-single">
                    <ClassIcon
                        border={2}
                        size={20}
                        {classId}
                    />
                </div>

                {#if hasSoon}
                    <CollectedIcon soon={true} />
                {/if}
            {:else if item.type === RewardType.Recipe}
                {@const ability = $staticStore.professionAbilityByItemId[item.id]}
                {#if ability}
                    <div class="player-class">
                        <ProfessionIcon id={ability.professionId} />
                    </div>
                {/if}
            {/if}
            
            {#if item.extraAppearances > 0}
                <div class="collected-appearances background-box drop-shadow-single">
                    +{item.extraAppearances}
                </div>
            {/if}

            {#if appearance.userHas}
                <CollectedIcon />
            {/if}

            {#if dataItem.allianceOnly || dataItem.hordeOnly}
                <div class="player-faction drop-shadow-single">
                    <FactionIcon faction={dataItem.allianceOnly ? Faction.Alliance : Faction.Horde} />
                </div>
            {/if}

            <div class="difficulties" use:basicTooltip={diffLong.join(' / ')}>
                {#each diffShort as difficulty}
                    <span>{difficulty}</span>
                {/each}
            </div>
        </div>
    {/if}
{/each}
