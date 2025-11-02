<script lang="ts">
    import { fancyHolidays, holidayIds, type FancyHoliday } from '@/data/holidays';
    import { activeHolidays, type ActiveHoliday } from '@/user-home/state/activeHolidays.svelte';
    import Holiday from './Holiday.svelte';
    import { timeState } from '@/shared/state/time.svelte';

    let active = $derived(activeHolidays.value);
    let activeFancyHolidays = $derived.by(() => {
        const ret = fancyHolidays
            .map(
                (fancyHoliday) =>
                    [
                        fancyHoliday,
                        (holidayIds[fancyHoliday.holiday] || [])
                            .map((id) => active[`h${id}`])
                            .filter((a) => !!a),
                    ] as [FancyHoliday, ActiveHoliday[]]
            )
            .filter(([, activeData]) => activeData.length > 0);

        ret.sort((a, b) => {
            const aSoon = a[1][0].startDate > timeState.slowTime;
            const bSoon = b[1][0].startDate > timeState.slowTime;
            if (aSoon && !bSoon) {
                return 1;
            } else if (!aSoon && bSoon) {
                return -1;
            } else if (aSoon && bSoon) {
                return a[1][0].startDate.diff(b[1][0].startDate).toMillis();
            } else if (!aSoon && !bSoon) {
                return a[1][0].endDate.diff(b[1][0].endDate).toMillis();
            }
            return 0;
        });
        console.log(ret);

        return ret;
    });
</script>

{#each activeFancyHolidays as [fancyHoliday] (fancyHoliday)}
    <Holiday {fancyHoliday} />
{/each}
