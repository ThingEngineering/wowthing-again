<script lang="ts">
    import { weekliesHead } from '@/data/quests'
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import { getActiveHoliday } from '@/utils/get-active-holiday'

    $: activeHoliday = getActiveHoliday($userStore.data)
</script>

{#each $settings.layout.homeWeeklies as weekly}
    {#if !weekly.startsWith('holiday') || weekly === activeHoliday}
        <td>{weekliesHead[weekly]}</td>
    {/if}
{/each}
