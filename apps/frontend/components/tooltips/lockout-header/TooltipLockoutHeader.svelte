<script lang="ts">
    import { difficultyMap, journalDifficultyOrder } from '@/data/difficulty';
    import { staticStore } from '@/shared/stores/static';
    import { userStore } from '@/stores';
    import type { Difficulty } from '@/types';

    export let difficulty: Difficulty;
    export let instanceId: number;

    $: instance = $staticStore.instances[instanceId];

    let byDifficulty: Record<number, number>;
    let count: number;
    $: {
        byDifficulty = {};
        count = 0;

        const lockouts = $userStore.allLockouts.filter(
            (lockout) => lockout.instanceId === instanceId,
        );
        for (const lockout of lockouts) {
            for (const [, characterLockout] of lockout.characters) {
                byDifficulty[characterLockout.difficulty] =
                    (byDifficulty[characterLockout.difficulty] || 0) + 1;
                count++;
            }
        }
    }
</script>

<div class="wowthing-tooltip">
    <h4 class="no-border">{instance?.name ?? `Unknown instance #${instanceId}`}</h4>

    {#if difficulty}
        <h5>{difficulty.name}</h5>
    {/if}

    <table class="table-tooltip-lockout table-striped">
        <tbody>
            {#if count > 0}
                {#each journalDifficultyOrder as difficulty}
                    {@const difficultyCount = byDifficulty[difficulty]}
                    {#if difficultyCount}
                        <tr>
                            <td>
                                <code>{difficultyMap[difficulty].shortName}</code>
                            </td>
                            <td class="r">
                                {difficultyCount} character(s)
                            </td>
                        </tr>
                    {/if}
                {/each}
            {:else}
                <tr>
                    <td>No characters have a lockout</td>
                </tr>
            {/if}
        </tbody>
    </table>

    {#if count > 0}
        <div class="bottom">
            {count} character(s)
        </div>
    {/if}
</div>
