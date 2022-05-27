<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import xor from 'lodash/xor'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { difficultyMap, journalDifficultyOrder } from '@/data/difficulty'
    import { userTransmogStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import { PlayableClass, PlayableClassMask } from '@/types/enums'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { JournalDataEncounterItem, JournalDataEncounterItemAppearance } from '@/types/data/journal'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let bonusIds: Record<number, number> = undefined
    export let item: JournalDataEncounterItem

    let appearances: [JournalDataEncounterItemAppearance, boolean][]
    let classId: number
    let element: HTMLElement
    let intersected = false
    $: {
        appearances = item.appearances.map((appearance) => [
            appearance,
            $settingsData.transmog.completionistMode ?
                $userTransmogStore.data.sourceHas[`${item.id}_${appearance.modifierId}`] :
                $userTransmogStore.data.userHas[appearance.appearanceId]
        ])

        if (item.classMask in PlayableClassMask) {
            classId = PlayableClass[PlayableClassMask[item.classMask]]
        }
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

    const getDifficulties = function(appearance: JournalDataEncounterItemAppearance): string[] {
        if (!appearance.difficulties) {
            return []
        }

        // 10 Normal + 25 Normal + Normal? = Normal
        if (xor(appearance.difficulties, [3, 4]).length === 0 ||
            xor(appearance.difficulties, [3, 4, 14]).length === 0) {
            return ['N']
        }
        // 10 Heroic + 25 Heroic + Heroic? = Heroic
        if (xor(appearance.difficulties, [5, 6]).length === 0 ||
            xor(appearance.difficulties, [5, 6, 15]).length === 0) {
            return ['H']
        }
        // 10 Normal + 25 Normal + 10 Heroic + 25 Heroic = Normal/Heroic (ZA/ZG)
        if (xor(appearance.difficulties, [3, 4, 5, 6]).length === 0) {
            return ['N', 'H']
        }

        const ret: string[] = []
        for (const difficulty of journalDifficultyOrder) {
            if (appearance.difficulties.indexOf(difficulty) >= 0) {
                ret.push(difficultyMap[difficulty].shortName)
            }
        }
        return ret
    }
</script>

<style lang="scss">
    .journal-item {
        height: 52px;
        width: 52px;
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
    .difficulties {
        position: absolute;
        bottom: 1px;
        left: 50%;
        transform: translateX(-50%);

        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        display: inline-flex;
        //font-size: 0.9rem;
        line-height: 1;
        padding: 0 2px 1px 2px;
        pointer-events: none;
        white-space: nowrap;
    }
</style>

{#each appearances as [appearance, userHas]}
    {#if
        ($journalState.showCollected && userHas) ||
        ($journalState.showUncollected && !userHas)
    }
        <IntersectionObserver once {element} bind:intersecting={intersected}>
            <div
                bind:this={element}
                class="journal-item quality{getQuality(appearance)}"
                class:missing={
                    (!$journalState.highlightMissing && !userHas) ||
                    ($journalState.highlightMissing && userHas)
                }
            >
                {#if intersected}
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

                    {#if userHas}
                        <div class="collected-icon drop-shadow">
                            <IconifyIcon icon={mdiCheckboxOutline} />
                        </div>
                    {/if}

                    <div class="difficulties">
                        {#each getDifficulties(appearance) as difficulty}
                            <span>{difficulty}</span>
                        {/each}
                    </div>
                {/if}
            </div>
        </IntersectionObserver>
    {/if}
{/each}
