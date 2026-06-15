<script lang="ts">
    import { delveMap } from '@/data/delve';

    let { delves }: { delves: { poiId: number; story: string }[] } = $props();
</script>

<style lang="scss">
    table {
        width: 24rem;
    }
    td {
        text-align: left;
    }
    .name {
        width: 12rem;
    }
    .story {
        width: 12rem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>Bountiful Delves</h4>
    <table class="table table-striped">
        <tbody>
            {#each delves as { poiId, story } (poiId)}
                {@const delve = delveMap[poiId]}
                {#if delve}
                    <tr>
                        <td class="name text-overflow">{delve.name}</td>
                        <td class="story quality{delve.storyRanks[story] ?? 3}">{story}</td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>
