<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { keyVaultItemLevel } from '@/data/dungeon'
    import { timeStore } from '@/shared/stores/time'
    import { userStore } from '@/stores'
    import { getVaultQualityByItemLevel } from '@/utils/mythic-plus'
    import { getDungeonLevel } from '@/utils/mythic-plus/get-dungeon-level'
    import type { Character, CharacterMythicPlusAddonRun, CharacterWeeklyProgress } from '@/types'

    import Run from './TooltipVaultMythicPlusRun.svelte'

    export let character: Character

    let improve: [string, number][]
    let progress: CharacterWeeklyProgress[]
    let runs: CharacterMythicPlusAddonRun[]
    $: {
        progress = character.weekly?.vault?.mythicPlusProgress

        const currentPeriod = userStore.getCurrentPeriodForCharacter($timeStore, character)
        runs = sortBy(
            character.mythicPlusWeeks?.[currentPeriod.endTime.toUnixInteger()] || [],
            (run: CharacterMythicPlusAddonRun) => -run.level
        )

        const firstLevel = getDungeonLevel(progress[0])
        const betterOptions = keyVaultItemLevel.filter(([level,]) => level > firstLevel)
        improve = []
        for (let i = betterOptions.length - 1; i >= 0; i--) {
            const [keyLevel,] = betterOptions[i]
            let keyRange = keyLevel.toString()
            if (betterOptions[i - 1] && (betterOptions[i - 1][0] - keyLevel) > 1) {
                if (keyLevel === 0) {
                    keyRange = '0'
                }
                else {
                    keyRange = `${keyLevel} - ${betterOptions[i-1][0] - 1}`
                }
            }
            else if (keyRange === '-1') {
                keyRange = 'H'
            }

            improve.push([keyRange, betterOptions[i][1]])
            if (improve.length === 3) {
                break
            }
        }
    }
</script>

<style lang="scss">
    .view {
        gap: 1rem;
    }
    .level-range {
        word-spacing: -0.3ch;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name} - Dungeon Vault</h4>
    <div class="view">
        <table
            class="table-striped"
            class:border-right={improve.length > 0}
        >
            <tbody>
                {#each Array(progress[2].threshold) as _, i}
                    <Run index={i} run={runs[i]} {progress} />
                {/each}
            </tbody>
        </table>

        {#if improve.length > 0}
            {@const useImprove = improve.slice(0, 3)}
            <table
                class="table-striped border-left"
                class:border-bottom={runs.length > 1 || useImprove.length < 3}
            > 
                <tbody>
                    {#each useImprove as [levelRange, itemLevel]}
                        <tr>
                            <td class="level-range">
                                {levelRange}
                            </td>
                            <td
                                class="quality{getVaultQualityByItemLevel(itemLevel)}"
                            >{itemLevel}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>
