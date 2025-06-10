<script lang="ts">
    import { difficultyMap, journalDifficultyOrder } from '@/data/difficulty';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import type { Difficulty } from '@/types';

    let { difficulty, instanceId }: { difficulty: Difficulty; instanceId: number } = $props();

    let instance = $derived(wowthingData.static.instanceById.get(instanceId));

    let byDifficulty = $derived.by(() => {
        const ret: Record<number, number> = {};
        const lockouts = userState.general.allLockouts.filter(
            (lockout) => lockout.instanceId === instanceId
        );
        for (const lockout of lockouts) {
            for (const [, characterLockout] of lockout.characters) {
                ret[characterLockout.difficulty] = (ret[characterLockout.difficulty] || 0) + 1;
            }
        }
        return ret;
    });
    let count = $derived(Object.values(byDifficulty).reduce((t, v) => t + v, 0));
</script>

<div class="wowthing-tooltip">
    <h4 class="no-border">{instance?.name ?? `Unknown instance #${instanceId}`}</h4>

    {#if difficulty}
        <h5>{difficulty.name}</h5>
    {/if}

    <table class="table-tooltip-lockout table-striped">
        <tbody>
            {#if count > 0}
                {#each journalDifficultyOrder as difficulty (difficulty)}
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
