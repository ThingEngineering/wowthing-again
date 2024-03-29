<script lang="ts">
    import { some } from 'lodash'

    import { difficultyMap } from '@/data/difficulty'
    import { Faction } from '@/enums/faction'
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class'
    import { itemStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import { getItemUrl } from '@/utils/get-item-url'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { JournalDataEncounterItem, JournalDataEncounterItemAppearance } from '@/types/data/journal'

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte'
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let bonusIds: Record<number, number> = undefined
    export let item: JournalDataEncounterItem

    let classId: number
    $: {
        if (item.classMask in PlayableClassMask) {
            classId = PlayableClass[PlayableClassMask[item.classMask] as keyof typeof PlayableClass]
        }
        else {
            classId = 0
        }
    }

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

    const getDifficulties = function(appearance: JournalDataEncounterItemAppearance): [string[], string[]] {
        if (!appearance.difficulties) {
            return [[], []]
        }

        const ret: [string[], string[]] = [[], []]
        // LFR Legacy, LFR Raid
        if (some([7, 17], (id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[17].shortName)
            ret[1].push(difficultyMap[17].name)
        }
        // Normal Dungeon, 10 Normal, 25 Normal, 40 Normal, Normal Raid
        if (some([1, 3, 5, 9, 14], (id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[14].shortName)
            ret[1].push(difficultyMap[14].name)
        }
        // Heroic Dungeon, 10 Heroic, 25 Heroic, Heroic Raid
        if (some([2, 4, 6, 15], (id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[15].shortName)
            ret[1].push(difficultyMap[15].name)
        }
        // Mythic Dungeon, Mythic Keystone, Mythic Raid
        if (some([23, 8, 16], (id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[16].shortName)
            ret[1].push(difficultyMap[16].name)
        }
        // Timewalking Dungeon, Timewalking Raid
        if (some([24, 33], (id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[33].shortName)
            ret[1].push(difficultyMap[33].name)
        }
        return ret
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
        {@const [diffShort, diffLong] = getDifficulties(appearance)}
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
                <div class="player-class class-{classId} drop-shadow-single">
                    <ClassIcon
                        border={2}
                        size={20}
                        {classId}
                    />
                </div>
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
