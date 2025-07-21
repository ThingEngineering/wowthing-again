<script lang="ts">
    import { fancyHolidays } from '@/data/holidays';
    import { activeHolidays } from '@/user-home/state/activeHolidays.svelte';
    import Holiday from './Holiday.svelte';

    let active = $derived(activeHolidays.value);
</script>

{#each fancyHolidays as fancyHoliday (fancyHoliday)}
    {@const activeHoliday = active[fancyHoliday.holiday]}
    {#if activeHoliday}
        <Holiday {activeHoliday} {fancyHoliday} />
    {/if}
{/each}
