<script lang="ts">
    type Props = {
        groupedLockouts: [string, number][];
        colspan: number;
    };
    let { groupedLockouts, colspan }: Props = $props();
</script>

<style lang="scss">
    th {
        padding: 0.2rem 0.3rem;
        white-space: nowrap;
    }
</style>

<tr>
    <th {colspan}></th>
    {#each groupedLockouts as [shortName, difficultyCount]}
        <th class="c b-l b-b" colspan={difficultyCount}>
            {shortName}
        </th>
    {/each}
</tr>
