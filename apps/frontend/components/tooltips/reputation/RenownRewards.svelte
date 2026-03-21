<script lang="ts">
    import type { StaticDataRenownReward } from '@/shared/stores/static/types';

    let { rewards }: { rewards: StaticDataRenownReward[] } = $props();
</script>

<style lang="scss">
    table {
        font-size: 95%;
        margin-top: 0.5rem;
        width: 100%;
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
                            {#if desc}
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
