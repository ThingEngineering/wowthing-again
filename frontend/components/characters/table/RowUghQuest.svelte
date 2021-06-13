<script lang="ts">
    import type {CharacterWeeklyUghQuest} from '@/types'
    //import tippy from '@/utils/tippy'

    export let ughQuest: CharacterWeeklyUghQuest
</script>

<style lang="scss">
    td {
        padding-left: 0.2rem;
        padding-right: 0.7rem;
        white-space: nowrap;
        word-spacing: -0.2ch;

        &.status2 {
            color: #1eff00;
        }
        &.status1 {
            color: #ffff00;
            text-align: right;
        }
        &.status0 {
            color: #ff1e00;
        }

        span {
            color: #bbb;
        }
    }
</style>

<td class="status{ughQuest.status}">
    {#if ughQuest.status === 2}
        Done
    {:else if ughQuest.status === 1}
        {ughQuest.have} <span>/</span> {ughQuest.need}
    {:else}
        Get!
    {/if}
</td>
