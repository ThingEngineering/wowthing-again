<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { classOrderMap } from '@/data/character-class'
    import { difficultyMap, journalDifficultyMap, journalDifficultyOrder } from '@/data/difficulty'
    import { PlayableClass, playableClasses } from '@/enums/playable-class'
    import { lazyStore, userAchievementStore } from '@/stores'
    import { UserCount } from '@/types'
    import { leftPad } from '@/utils/formatting'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { JournalDataEncounter } from '@/types/data'

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte'

    export let encounter: JournalDataEncounter = undefined
    export let statsKey: string

    let classCounts: [number, keyof typeof PlayableClass][]
    let difficulties: [number, number, number, number][]
    $: {
        difficulties = []
        for (const difficulty of journalDifficultyOrder) {
            const difficultyKey = `${statsKey}--${difficulty}`
            const difficultyStats = $lazyStore.journal.stats[difficultyKey]
            if (difficultyStats) {
                let kills = -1

                for (const difficultyId of (difficultyUgh[difficulty] || [difficulty])) {
                    const statisticIds = encounter?.statistics?.[difficultyId] ?? []
                    if (statisticIds.length > 0) {
                        const newKills = statisticIds.reduce(
                            (a, b) => a + ($userAchievementStore.statistics?.[b] || [])
                                .reduce((c, d) => c + d[1], 0)
                        , 0)
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

        // Fix weird old instances
        const normalDifficulties = difficulties.filter((d) => d[0] === 3 || d[0] === 4)
        const heroicDifficulties = difficulties.filter((d) => d[0] === 5 || d[0] === 6)
        if (
            normalDifficulties.length === 2 &&
            normalDifficulties[0][1] === normalDifficulties[1][1] &&
            normalDifficulties[0][2] === normalDifficulties[1][2] &&
            heroicDifficulties.length === 2 &&
            heroicDifficulties[0][1] === heroicDifficulties[1][1] &&
            heroicDifficulties[0][2] === heroicDifficulties[1][2]
        ) {
            const newNormal = difficulties.filter((d) => d[0] === 14)[0]
            if (newNormal) {
                difficulties = difficulties.filter((d) => d[0] !== 3 && d[0] !== 4)
                newNormal[1] += normalDifficulties[0][1]
                newNormal[2] += normalDifficulties[0][2]
            }
            else {
                difficulties = difficulties.filter((d) => d[0] !== 4)
                normalDifficulties[0][0] = 14
            }

            const newHeroic = difficulties.filter((d) => d[0] === 15)[0]
            if (newHeroic) {
                difficulties = difficulties.filter((d) => d[0] !== 5 && d[0] !== 6)
                newHeroic[1] += heroicDifficulties[0][1]
                newHeroic[2] += heroicDifficulties[0][2]
            }
            else {
                difficulties = difficulties.filter((d) => d[0] !== 6)
                heroicDifficulties[0][0] = 15
            }

            difficulties.sort((a, b) => journalDifficultyMap[a[0]] - journalDifficultyMap[b[0]])
        }

        classCounts = []
        for (const [className,] of playableClasses) {
            const classKey = `${statsKey}--class:${className}`
            const classStats = $lazyStore.journal.stats[classKey]
            if (classStats) {
                classCounts.push([classStats.total, className as keyof typeof PlayableClass])
            }
        }

        classCounts = sortBy(
            classCounts,
            ([count, className]) => [
                leftPad(1000 - count, 3, '0'),
                leftPad(classOrderMap[PlayableClass[className]], 2, '0')
            ])
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
    .classes {
        --image-border-width: 1px;
        --image-margin-top: 1px;

        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        margin-left: auto;
    }
    .stats {
        align-items: center;
        display: flex;
        white-space: nowrap;

        + .stats {
            margin-left: 0.4rem;
        }
        :global(img) {
            margin-right: 0.2rem;
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
    .kills {
        color: #aaa;
        font-size: 90%;
        margin-left: 0.3rem;
        word-spacing: -0.3ch;
    }
</style>

{#if difficulties}
    <div class="difficulties">
        {#each difficulties as [difficulty, have, total, kills]}
            <div
                class="stats"
                data-id="{difficulty}"
                use:basicTooltip={`${difficultyMap[difficulty].name}${kills >= 0 ? ` - ${kills} kill(s)` : ''}`}
            >
                <span class="difficulty">
                    {difficultyMap[difficulty].shortName}
                </span>
                <CollectibleCount counts={new UserCount(have, total)} />
                
                {#if kills >= 0}
                    <span class="kills">
                        ( {kills.toLocaleString()} )
                    </span>
                {/if}
            </div>
        {/each}
    </div>
{/if}

{#if classCounts}
    <div class="classes">
        {#each classCounts as [count, className]}
            <div class="stats">
                <ClassIcon
                    border={1}
                    classId={PlayableClass[className]}
                    size={16}
                />
                {count}
            </div>
        {/each}
    </div>
{/if}
