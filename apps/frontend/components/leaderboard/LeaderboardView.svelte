<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import tippy from '@/utils/tippy'
    import type { LeaderboardEntry } from '@/types'

    import Paginate from '@/components/common/Paginate.svelte'

    export let page = 1
    export let slug: string

    const data = JSON.parse(document.getElementById('app').getAttribute('data-leaderboard')) as LeaderboardEntry[]

    const currentUser = document.getElementById('user-name')?.innerText || null

    let sortedData: [number, string, boolean, number][]
    let title: string
    $: {
        let tempData: [string, boolean, number][]
        if (slug === 'completed-quests') {
            tempData = data.map((entry) => [entry.username, entry.linkTo, entry.completedQuestCount])
            title = 'Completed Quests'
        }

        tempData = sortBy(
            tempData.filter(([,, value]) => value > 0),
            ([,, value]) => 1_000_000 - value
        )

        let lastValue = 0
        let rank = 0
        let rankSkip = 1
        sortedData = []
        for (const [username, linkTo, value] of tempData) {
            if (value === lastValue) {
                rankSkip++
            }
            else {
                lastValue = value
                rank += rankSkip
                rankSkip = 1
            }

            sortedData.push([rank, username, linkTo, value])
        }
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .title {
        padding-left: 1rem;
    }
    .leaderboard {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding-top: 0.5rem;
    }
    .leaderboard-entry {
        align-items: center;
        display: flex;
        padding: 0.3rem;
        width: 10rem;
    }
    .rank {
        border-right: 1px solid $border-color;
        flex-shrink: 0;
        font-size: 150%;
        padding-right: 0.3rem;
        text-align: center;
        width: 4rem;
    }
    .info {
        flex-grow: 1;
        min-width: 0;
        padding-left: 0.3rem;

        > div {
            text-align: center;
        }
    }
</style>

<div class="wrapper">
    <Paginate
        items={sortedData}
        perPage={100}
        {page}
        let:paginated
    >
        <div class="leaderboard">
            {#each paginated as [rank, username, linkTo, score]}
                <div
                    class="leaderboard-entry border"
                    class:border-success={username !== null && username === currentUser}
                >
                    <div class="rank">
                        {rank.toLocaleString()}
                    </div>
                    <div class="info">
                        <div
                            class="name text-overflow"
                            use:tippy={username}
                        >
                            {#if linkTo}
                                <a href="/user/{username}#/" target="_blank">{username}</a>
                            {:else}
                                {username}
                            {/if}
                        </div>
                        <div class="score">{score.toLocaleString()}</div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="title" slot="bar-end">
            {title}
        </div>
    </Paginate>
</div>
