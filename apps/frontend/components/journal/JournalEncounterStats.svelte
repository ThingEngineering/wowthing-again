<script lang="ts">
    import { difficultyMap, journalDifficultyOrder } from '@/data/difficulty'
    import { farmTypeIcons } from '@/data/icons'

    import { journalStore, userAchievementStore } from '@/stores'
    import { FarmType } from '@/types/enums'
    import getPercentClass from '@/utils/get-percent-class'
    import tippy from '@/utils/tippy'
    import type { JournalDataEncounter } from '@/types/data'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let encounter: JournalDataEncounter = undefined
    export let statsKey: string

    let difficulties: [number, number, number, number][]
    $: {
        difficulties = []
        for (const difficulty of journalDifficultyOrder) {

            const difficultyKey = `${statsKey}--${difficulty}`
            const difficultyStats = $journalStore.data.stats[difficultyKey]
            if (difficultyStats) {
                let kills = -1

                for (const difficultyId of (difficultyUgh[difficulty] || [difficulty])) {
                    const statisticId = encounter?.statistics?.[difficultyId] ?? 0
                    if (statisticId) {
                        const newKills = ($userAchievementStore.data.statistics?.[statisticId] || [])
                            .reduce((a, b) => a + b[1], 0)
                        kills = kills === -1 ? newKills : kills + newKills
                    }
                }

                difficulties.push([
                    difficulty,
                    difficultyStats.have,
                    difficultyStats.total,
                    kills,
                ])
            }
        }
    }

    const difficultyUgh: Record<number, number[]> = {
        14: [3, 4, 14], // Normal -> 10 Normal, 25 Normal, Normal
    }
</script>

<style lang="scss">
    .difficulties {
        --image-margin-top: -2px;

        display: flex;
        //margin-left: auto;
        margin-left: 1rem;
    }
    .stats {
        display: flex;
        white-space: nowrap;

        + .stats {
            margin-left: 0.4rem;
        }
    }
    .difficulty {
        background: $active-background;
        border: 1px solid $border-color;
        display: inline-block;
        font-weight: 600;
        margin: -1px 0;
        padding: 0 0.3rem;
    }
    .counts {
        font-size: 0.95rem;
        margin-left: 0.3rem;
    }
    .kills {
        font-size: 0.95rem;
        margin-left: 0.3rem;
    }
</style>

{#if difficulties}
    <div class="difficulties">
        {#each difficulties as [difficulty, have, total, kills]}
            <div
                class="stats"
                data-id="{difficulty}"
                use:tippy={difficultyMap[difficulty].name}
            >
                <span class="difficulty">
                    {difficultyMap[difficulty].shortName}
                </span>
                <span class="counts {getPercentClass(have / total * 100)}">
                    <em>{have}</em> / <em>{total}</em>
                </span>
                
                {#if kills >= 0}
                    <span class="kills">
                        <IconifyIcon
                            icon={farmTypeIcons[FarmType.Kill]}
                            scale='0.81'
                        />
                        {kills.toLocaleString()}
                    </span>
                {/if}
            </div>
        {/each}
    </div>
{/if}
