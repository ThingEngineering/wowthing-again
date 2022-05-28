<script lang="ts">
    import { Constants } from '@/data/constants'
    import { currentSetItems, currentSetLookup } from '@/data/gear'
    import { classUnity, legendaryBonusIDs } from '@/data/legendary'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/tier-set/TooltipTierSet.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let legendaries: [number, number][]
    let tierCount: number
    let tierPieces: [string, number][]
    $:
    {
        legendaries = [[0, 0], [0, 0]]
        tierCount = 0

        if (character.equippedItems) {
            const tierPieceMap: Record<string, number> = {}
            for (const [tierSlot, ] of currentSetItems) {
                tierPieceMap[tierSlot] = 0
            }

            for (const slot in character.equippedItems) {
                const item = character.equippedItems[slot]

                if (item.quality === 5) {
                    for (const bonusId of item.bonusIds) {
                        // Quest Unity?
                        if (bonusId === 7578 || bonusId === 7579) {
                            legendaries[1] = [item.itemLevel, classUnity[character.classId]]
                            break
                        }

                        const spellId = legendaryBonusIDs[bonusId]
                        if (spellId) {
                            // Crafted Unity
                            if (bonusId >= 8119 && bonusId <= 8130) {
                                legendaries[1] = [item.itemLevel, spellId]
                            }
                            else {
                                legendaries[0] = [item.itemLevel, spellId]
                            }
                            break
                        }
                    }
                }
                else {
                    const tierSlot = currentSetLookup[item.itemId]
                    if (tierSlot) {
                        tierCount++
                        tierPieceMap[tierSlot] = item.itemLevel
                    }
                }
            }

            tierPieces = currentSetItems
                .map((x) => [x[0], tierPieceMap[x[0]]])
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-home-gear);

        //--image-margin-top: 0;
        --link-color: #{ $quality5-color };

        border-left: 1px solid $border-color;
    }
    .flex-wrapper {
        --image-margin-top: -2px !important;

        height: 24px;
    }
    span {
        &.status-fail {
            :global(img) {
                margin-right: 7px;
            }
        }

        &:not(:last-child) {
            width: 3.6rem;
        }
        &:last-child {
            word-spacing: -0.1ch;
        }

        :global(img) {
            margin-right: 2px;
        }
    }
</style>

<td>
    {#if character.level === Constants.characterMaxLevel}
        <div class="flex-wrapper">
            {#each legendaries as [itemLevel, spellId]}
                {#if itemLevel > 0}
                    <span>
                        <WowheadLink
                            type="spell"
                            id={spellId}
                        >
                            <WowthingImage
                                name="spell/{spellId}"
                                size={20}
                                border={1}
                            />
                            {itemLevel}
                        </WowheadLink>
                    </span>
                {:else}
                    <span class="status-fail">
                        <WowthingImage
                            name={'invalid'}
                            size={20}
                            border={1}
                        />
                        &mdash;
                    </span>
                {/if}
            {/each}

            <span
                class:status-shrug={tierCount >= 2 && tierCount < 4}
                class:status-success={tierCount >= 4}
                use:tippyComponent={{
                    component: Tooltip,
                    props: {character, tierPieces},
                }}
            >{tierCount} pc</span>
        </div>
    {/if}
</td>
