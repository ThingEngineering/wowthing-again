<script lang="ts">
    import { some } from 'lodash'

    import { difficultyMap } from '@/data/difficulty'
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class'
    import { RewardType } from '@/enums/reward-type'
    import { userStore, userTransmogStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { journalState } from '@/stores/local-storage'
    import { settingsStore } from '@/stores'
    import { getItemUrl } from '@/utils/get-item-url'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { JournalDataEncounterItem, JournalDataEncounterItemAppearance } from '@/types/data/journal'

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let bonusIds: Record<number, number> = undefined
    export let item: JournalDataEncounterItem

    let appearances: [JournalDataEncounterItemAppearance, boolean][]
    let classId: number
    $: {
        if (item.type === RewardType.Illusion) {
            appearances = item.appearances.map((appearance) => [
                appearance,
                $userTransmogStore.hasIllusion.has(
                    $staticStore.illusions[appearance.appearanceId].enchantmentId
                ),
            ])
        }
        else if (item.type === RewardType.Mount) {
            appearances = item.appearances.map((appearance) => [
                appearance,
                $userStore.hasMount[item.classId],
            ])
        }
        else if (item.type === RewardType.Pet) {
            appearances = item.appearances.map((appearance) => [
                appearance,
                $userStore.hasPet[item.classId],
            ])
        }
        else if (item.type === RewardType.Toy) {
            appearances = item.appearances.map((appearance) => [
                appearance,
                $userStore.hasToy[item.id],
            ])
        }
        else {
            appearances = item.appearances.map((appearance) => [
                appearance,
                $settingsStore.transmog.completionistMode ?
                    $userTransmogStore.hasSource.has(`${item.id}_${appearance.modifierId}`) :
                    $userTransmogStore.hasAppearance.has(appearance.appearanceId),
            ])
        }

        if (item.classMask in PlayableClassMask) {
            classId = PlayableClass[PlayableClassMask[item.classMask] as keyof typeof PlayableClass]
        }
        else {
            classId = 0
        }

        //console.log(item, appearances)
    }

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
        if (some([1, 3, 4, 9, 14], (id) => appearance.difficulties.indexOf(id) >= 0)) {
            ret[0].push(difficultyMap[14].shortName)
            ret[1].push(difficultyMap[14].name)
        }
        // Heroic Dungeon, 10 Heroic, 25 Heroic, Heroic Raid
        if (some([2, 5, 6, 15], (id) => appearance.difficulties.indexOf(id) >= 0)) {
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

        :global(img) {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

        }
    }
    .player-class {
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        left: -1px;
        width: 24px;
        position: absolute;
        top: -1px;
    }
    .collected-appearances {
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        color: $color-success;
        line-height: 1;
        padding: 0.1rem 0.2rem;
        pointer-events: none;
        position: absolute;
        top: 30px;
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

{#each appearances as [appearance, userHas]}
    {#if
        ($journalState.showCollected && userHas) ||
        ($journalState.showUncollected && !userHas)
    }
        {@const [diffShort, diffLong] = getDifficulties(appearance)}
        <div
            class="journal-item quality{getQuality(appearance)}"
            class:missing={
                (!$journalState.highlightMissing && !userHas) ||
                ($journalState.highlightMissing && userHas)
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
                <div class="player-class class-{classId} drop-shadow">
                    <ClassIcon
                        border={2}
                        size={20}
                        {classId}
                    />
                </div>
            {/if}
            
            {#if item.extraAppearances > 0}
                <div class="collected-appearances background-box drop-shadow">
                    +{item.extraAppearances}
                </div>
            {/if}

            {#if userHas}
                <CollectedIcon />
            {/if}

            <div class="difficulties" use:basicTooltip={diffLong.join(' / ')}>
                {#each diffShort as difficulty}
                    <span>{difficulty}</span>
                {/each}
            </div>
        </div>
    {/if}
{/each}
