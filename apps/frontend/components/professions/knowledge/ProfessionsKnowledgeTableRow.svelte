<script lang="ts">
    import { dragonflightKnowledge, dragonflightProfessionMap, dragonflightProfessions } from '@/data/professions'
    import { userQuestStore } from '@/stores'
    import { UserCount } from '@/types'
    import type { Profession } from '@/enums'
    import type {  Character } from '@/types'
    import getPercentClass from '@/utils/get-percent-class';

    export let character: Character

    let counts: UserCount[]
    $: {
        counts = []

        dragonflightKnowledge.forEach((dk) => {
            if (dk === null) {
                counts.push(null)
                return
            }

            const dkCount = new UserCount()
            
            for (const professionId of dk.masters) {
                if (character.professions?.[professionId]) {
                    const profData = dragonflightProfessionMap[professionId]
                    
                    dkCount.total++
                    if (userQuestStore.hasAny(character.id, profData.masterQuestId)) {
                        dkCount.have++
                    }
                }
            }
            
            for (const profData of dragonflightProfessions) {
                if (!character.professions?.[profData.id]) {
                    continue
                }

                if (dk.shortName === 'VD') {
                    for (const bookQuest of (profData.bookQuests || [])) {
                        dkCount.total++
                        if (userQuestStore.hasAny(character.id, bookQuest.questId)) {
                            dkCount.have++
                        }
                    }
                }

                const treasureQuests = (profData.treasureQuests || []).filter((tq) => tq.source === dk.shortName)
                for (const treasureQuest of treasureQuests) {
                    dkCount.total++
                    if (userQuestStore.hasAny(character.id, treasureQuest.questId)) {
                        dkCount.have++
                    }
                }
            }

            counts.push(dkCount)
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
    {@const count = counts[dkIndex]}
    {#if dk === null}
        <td class="spacer"></td>
    {:else if count.total > 0}
        <td
            class="profession-knowledge"
            class:status-fail={count.have === 0}
            class:status-shrug={count.have > 0 && count.have < count.total}
            class:status-success={count.have === count.total}
        >
            {count.have} / {count.total}
        </td>
    {:else}
        <td class="profession-knowledge faded">---</td>
    {/if}
{/each}
