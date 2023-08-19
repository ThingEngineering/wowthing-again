<script lang="ts">
    import orderBy from 'lodash/orderBy'

    import {
        dragonflightKnowledge,
        dragonflightProfessionMap,
        dragonflightProfessions
    } from '@/data/professions'
    import { Profession } from '@/enums'
    import { itemStore, userQuestStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
    import type {  Character } from '@/types'

    import Tooltip from '@/components/tooltips/profession-knowledge/TooltipProfessionKnowledge.svelte'

    export let character: Character

    type ZoneData  = {
        have: boolean
        itemId: number
        profession: Profession
        source?: string
    }
    let data: ZoneData[][]
    $: {
        data = []

        // Zones
        dragonflightKnowledge.forEach((dkZone) => {
            if (dkZone === null) {
                data.push(null)
                return
            }

            const zoneData: ZoneData[] = []

            for (const professionId of dkZone.masters) {
                if (character.professions?.[professionId]) {
                    const profData = dragonflightProfessionMap[professionId]

                    zoneData.push({
                        have: userQuestStore.hasAny(character.id, profData.masterQuestId),
                        itemId: -1,
                        profession: professionId,
                    })
                }
            }
            
            for (const profData of dragonflightProfessions) {
                if (!character.professions?.[profData.id]) {
                    continue
                }

                if (dkZone.name.endsWith('Books')) {
                    const bookQuests = (profData.bookQuests || []).filter((bq) =>
                        (['LN', 'ZCB'].indexOf(bq.source) >= 0 && dkZone.shortName === 'ZC') ||
                        (bq.source.startsWith(`${dkZone.shortName} `))
                    )
                    for (const bookQuest of orderBy(bookQuests, (bq) => $itemStore.items[bq.itemId].name)) {
                        zoneData.push({
                            have: userQuestStore.hasAny(character.id, bookQuest.questId),
                            itemId: bookQuest.itemId,
                            profession: profData.id,
                            source: bookQuest.source,
                        })
                    }
                }
                else { // not books
                    const treasureQuests = (profData.treasureQuests || []).filter((tq) => tq.source === dkZone.shortName)
                    for (const treasureQuest of treasureQuests) {
                        zoneData.push({
                            have: userQuestStore.hasAny(character.id, treasureQuest.questId),
                            itemId: treasureQuest.itemId,
                            profession: profData.id,
                        })
                    }
                }
            }

            zoneData.sort((a, b) => Profession[a.profession].localeCompare(Profession[b.profession]))

            data.push(zoneData)
        })
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
{#each dragonflightKnowledge as dk, dkIndex}
    {#if dk === null}
        <td class="spacer"></td>
    {:else}
        {@const zoneData = data[dkIndex]}
        {@const zoneHave = zoneData.filter((zd) => zd.have).length}
        {@const zoneTotal = zoneData.length}
        {#if zoneData.length > 0}
            <td
                class="profession-knowledge"
                class:status-fail={zoneHave === 0}
                class:status-shrug={zoneHave > 0 && zoneHave < zoneTotal}
                class:status-success={zoneHave === zoneTotal}
                use:tippyComponent={{
                    component: Tooltip,
                    props: {
                        character,
                        reputationId: dk.reputationId,
                        zoneData,
                        zoneName: dk.name,
                    }
                }}
            >
                {zoneHave} / {zoneTotal}
            </td>
        {:else}
            <td class="profession-knowledge faded">---</td>
        {/if}
    {/if}
{/each}
