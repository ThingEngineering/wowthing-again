<script lang="ts">
    import { fancyHolidays, holidayIds } from '@/data/holidays';
    import { activeHolidays } from '@/user-home/state/activeHolidays.svelte';
    import Holiday from './Holiday.svelte';

    let active = $derived(activeHolidays.value);
</script>

{#each fancyHolidays as fancyHoliday (fancyHoliday)}
    {#if holidayIds[fancyHoliday.holiday].some((id) => active[`h${id}`])}
        <Holiday {fancyHoliday} />
    {/if}
{/each}
