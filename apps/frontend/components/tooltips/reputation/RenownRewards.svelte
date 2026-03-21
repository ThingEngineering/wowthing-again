<script lang="ts">
    import type { StaticDataRenownReward } from '@/shared/stores/static/types';

    type Props = { reputationId: number; rewards: StaticDataRenownReward[] };
    let { reputationId, rewards }: Props = $props();

    // Prey: Season 1 has "New Quest Unlocked" descriptions, useful
    const useName = (level: number, index: number) =>
        reputationId === 2764 &&
        ((level === 1 && index === 0) ||
            (level === 3 && index === 0) ||
            (level === 4 && index === 0));
</script>

<style lang="scss">
    table {
        font-size: 95%;
        margin-top: 0.5rem;
        width: 24rem;
    }
    .level {
        --width: 2rem;

        text-align: right;
    }
    .text {
        --width: 100%;

        text-align: left;
    }
</style>

<table class="table table-striped b-t b-b">
    <tbody>
        {#each rewards as { level, names, toastDescriptions } (level)}
            <tr>
                <td class="level">{level}</td>
                <td class="text">
                    {#each { length: names.length }, index}
                        {@const name = names[index]}
                        {@const desc = toastDescriptions[index]}
                        <div class="reward">
                            {#if useName(level, index)}
                                Quests - {name}
                            {:else if desc}
                                {desc}
                            {:else}
                                {name || '???'} - ???
                            {/if}
                        </div>
                    {/each}
                </td>
            </tr>
        {/each}
    </tbody>
</table>
