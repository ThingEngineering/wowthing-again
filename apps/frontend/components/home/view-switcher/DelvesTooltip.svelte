<script lang="ts">
    import type { Delve } from '@/data/delve';

    let { delves }: { delves: [Delve, string, number][] } = $props();
</script>

<style lang="scss">
    table {
        width: 24rem;
    }
    td {
        text-align: left;
    }
    .name {
        width: 11rem;
    }
    .story {
        width: 13rem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>Bountiful Delves</h4>
    <table class="table table-striped">
        <tbody>
            {#each delves as [delve, story, ranking] (story)}
                <tr>
                    <td class="name text-overflow">{delve.name}</td>
                    <td class="story text-overflow quality{ranking}">{story}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
