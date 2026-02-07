<script lang="ts">
    import { fancyHolidays, holidayIds, type FancyHoliday } from '@/data/holidays';
    import { timeState } from '@/shared/state/time.svelte';
    import { activeHolidays, type ActiveHoliday } from '@/user-home/state/activeHolidays.svelte';

    import Holiday from './Holiday.svelte';

    let active = $derived(activeHolidays.value);
    let activeFancyHolidays = $derived.by(() => {
        const ret = fancyHolidays
            .map((fancyHoliday) => {
                const holidayData: [FancyHoliday, ActiveHoliday[]] = [fancyHoliday, []];

                const [nameIds, descriptionIds] = holidayIds[fancyHoliday.holiday] || [[]];
                holidayData[1].push(
                    ...(nameIds || []).map((nameId) => active[`name${nameId}`]).filter((a) => !!a)
                );
                holidayData[1].push(
                    ...(descriptionIds || [])
                        .map((descriptionId) => active[`desc${descriptionId}`])
                        .filter((a) => !!a)
                );

                return holidayData;
            })
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

        return ret;
    });
</script>

{#each activeFancyHolidays as [fancyHoliday, active] (fancyHoliday)}
    <Holiday {fancyHoliday} activeHoliday={active[0]} />
{/each}
