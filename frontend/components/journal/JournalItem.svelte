<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import xor from 'lodash/xor'

    import { difficultyMap, journalDifficultyOrder } from '@/data/difficulty'
    import { userTransmogStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { JournalDataEncounterItem, JournalDataEncounterItemAppearance } from '@/types/data/journal'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let bonusIds: Record<number, number> = undefined
    export let item: JournalDataEncounterItem

    let appearances: [JournalDataEncounterItemAppearance, boolean][]
    $: {
        appearances = []
        for (const appearance of item.appearances) {
            appearances.push([appearance, $userTransmogStore.data.userHas[appearance.appearanceId]])
        }
    }

    const getQuality = function(appearance: JournalDataEncounterItemAppearance): number {
        // Mythic Keystone/Mythic difficulties should probably set the quality to epic?
        for (const difficulty of appearance.difficulties) {
            if (difficulty !== 8 && difficulty !== 23) {
                return item.quality
            }
        }
        return 4
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
    .appearance {
        --image-border-width: 2px;

        margin-bottom: 0.5rem;
        margin-right: 0.25rem;
        position: relative;

        &.missing {
            opacity: 0.5;

            :global(img) {
                filter: grayscale(75%);
            }
        }
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
    .collected {
        color: $colour-success;
        position: absolute;
        top: -4px;
        right: -2px;
    }
</style>

{#each appearances as [appearance, userHas]}
    {#if
        ($journalState.showCollected && userHas) ||
        ($journalState.showUncollected && !userHas)
    }
        <div
            class="appearance quality{getQuality(appearance)}"
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

            {#if userHas}
                <div class="collected drop-shadow">
                    <IconifyIcon icon={mdiCheckboxOutline} />
                </div>
            {/if}

            <div class="difficulties" data-difficulties="{JSON.stringify(appearance.difficulties)}">
                {#each getDifficulties(appearance) as difficulty}
                    <span>{difficulty}</span>
                {/each}
            </div>
        </div>
    {/if}
{/each}
