<script lang="ts">
    import { fancyHolidays, type FancyHoliday } from '@/data/holidays';
    import { timeState } from '@/shared/state/time.svelte';
    import { activeHolidays, type ActiveHoliday } from '@/user-home/state/activeHolidays.svelte';

    import Holiday from './Holiday.svelte';

    let active = $derived(activeHolidays.value);
    let activeFancyHolidays = $derived.by(() => {
        const ret = fancyHolidays
            .map((fancyHoliday) => [fancyHoliday, active[fancyHoliday.holiday]])
            .filter(([, activeData]) => !!activeData) as [FancyHoliday, ActiveHoliday][];

        ret.sort((a, b) => {
            const aSoon = a[1].startDate > timeState.slowTime;
            const bSoon = b[1].startDate > timeState.slowTime;
            if (aSoon && !bSoon) {
                return 1;
            } else if (!aSoon && bSoon) {
                return -1;
            } else if (aSoon && bSoon) {
                return a[1].startDate.diff(b[1].startDate).toMillis();
            } else if (!aSoon && !bSoon) {
                return a[1].endDate.diff(b[1].endDate).toMillis();
            }
            return 0;
        });

        return ret;
    });
</script>

{#each activeFancyHolidays as [fancyHoliday, activeHoliday] (fancyHoliday)}
    <Holiday {fancyHoliday} {activeHoliday} />
{/each}
