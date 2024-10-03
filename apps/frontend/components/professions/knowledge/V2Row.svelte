<script lang="ts">
    import { warWithinProfessions } from '@/data/professions'
    import { warWithinZones } from '@/data/zones';
    import { Profession } from '@/enums/profession'
    import { dbStore } from '@/shared/stores/db'
    import { staticStore } from '@/shared/stores/static';
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { itemStore, userQuestStore } from '@/stores'
    import type {  Character } from '@/types'
    import type { TaskProfessionQuest } from '@/types/data';

    import Tooltip from '@/components/tooltips/profession-knowledge/TooltipProfessionKnowledge.svelte'

    export let character: Character

    type ZoneData = {
        have: number
        status?: string
        total: number
        items: ZoneItem[]
    }
    type ZoneItem = {
        have: boolean
        profession: Profession
        itemId?: number
        quest?: TaskProfessionQuest
        source?: string
    }

    let data: ZoneData[]
    $: {
        data = []

        // Zones
        for (const zone of warWithinZones) {
            if (zone === null) {
                data.push(null)
                continue
            }

            const zoneData: ZoneData = {
                have: 0,
                total: 0,
                items: [],
            }

            for (const profData of warWithinProfessions) {
                if (!character.professions?.[profData.id]) {
                    continue
                }
                
                if (zone.name.endsWith('Books')) {
                    const bookQuests = (profData.bookQuests || []).filter((bq) =>
                        (bq.source === zone.shortName) ||
                        (bq.source.startsWith(`${zone.shortName} `))
                    )

                    const characterRenown = zone.reputationId
                        ? Math.floor((character.reputations?.[zone.reputationId] ?? 0) / 2500)
                        : 0

                    for (const bookQuest of bookQuests) {
                        const bookData = {
                            have: userQuestStore.hasAny(character.id, bookQuest.questId),
                            quest: bookQuest,
                            profession: profData.id,
                        }

                        const requiredRenown = parseInt(bookQuest.source.split(' ')[1])
                        if (!bookData.have) {
                            if (!isNaN(requiredRenown) && requiredRenown <= characterRenown) {
                                zoneData.status = 'fail'
                            }
                            else if (bookQuest.source.startsWith('AC ') || bookQuest.source === 'LN') {
                                zoneData.status = 'fail'
                            }
                        }

                        zoneData.items.push(bookData)
                    }
                } else {
                    const things = dbStore.search({
                        maps: [
                            zone.map,
                        ],
                        tags: [
                            `expansion:10`,
                            `profession:${$staticStore.professions[profData.id].slug}`,
                            'treasure:profession'
                        ],
                    })

                    things.sort((a, b) => $itemStore.items[a.contents[0].id].name.localeCompare($itemStore.items[b.contents[0].id].name))

                    for (const thing of things) {
                        zoneData.items.push({
                            have: userQuestStore.hasAny(character.id, thing.trackingQuestId),
                            itemId: thing.contents[0].id,
                            profession: profData.id,
                            source: zone.shortName,
                        })
                    }
                }
            }

            zoneData.have = zoneData.items.filter((item) => item.have).length
            zoneData.total = zoneData.items.length
            zoneData.items.sort((a, b) => Profession[a.profession].localeCompare(Profession[b.profession]))

            if (zone.name.endsWith('Books')) {
                if (!zoneData.status) {
                    zoneData.status = zoneData.have < zoneData.total ? 'shrug' : 'success'
                }
            }
            else {
                zoneData.status = zoneData.have === 0
                    ? 'fail'
                    : (zoneData.have < zoneData.total ? 'shrug' : 'success')
            }

            data.push(zoneData)
        }
    }
</script>

<style lang="scss">
    .profession-knowledge {
        @include cell-width($width-progress, $maxWidth: $width-progress-max);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    .faded {
        color: #aaa;
    }
</style>

<td class="spacer"></td>
{#each warWithinZones as zone, zoneIndex}
    {@const zoneData = data[zoneIndex]}
    {#if zone === null}
        <td class="spacer"></td>
    {:else if zoneData.items.length > 0}
        <td
            class="profession-knowledge status-{zoneData.status}"
            use:componentTooltip={{
                component: Tooltip,
                props: {
                    character,
                    reputationId: 0,
                    zoneData,
                    zoneName: zone.name,
                }
            }}
        >
            {zoneData.have} / {zoneData.total}
        </td>
    {:else}
        <td class="profession-knowledge faded">---</td>
    {/if}
{/each}
