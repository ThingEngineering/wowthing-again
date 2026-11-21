<script lang="ts">
    import { DateTime } from 'luxon';

    import { timeState } from '@/shared/state/time.svelte';
    import { lazyState } from '@/user-home/state/lazy';
    import { toNiceDuration } from '@/utils/formatting';
    import type { ActiveHoliday } from '@/user-home/state/activeHolidays.svelte';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import type { UserCount } from '@/types';

    type Props = {
        activeHoliday: ActiveHoliday;
        achievementStats: UserCount;
        dropStats: UserCount;
        vendorStats: UserCount;
    };
    let { activeHoliday, achievementStats, dropStats, vendorStats }: Props = $props();
</script>

<style lang="scss">
    table {
        width: 22rem;
    }
    .label {
        --width: 3.5rem;

        text-align: right;
    }
    .time {
        --width: 12rem;

        text-align: right;
        white-space: nowrap;
    }
    .diff {
    }
</style>

{#snippet timeInfo(dateTime: DateTime)}
    {@const diff = dateTime.diff(timeState.time).toMillis()}
    <td class="time">{dateTime.toLocaleString(DateTime.DATETIME_MED)}</td>
    <td class="diff">
        {#if diff > 0}
            in {toNiceDuration(diff, { useNbsp: false })}
        {/if}
    </td>
{/snippet}

<div class="wowthing-tooltip">
    <h4>{activeHoliday.holiday.name}</h4>

    <table class="table table-striped">
        <tbody>
            <tr>
                <td class="label">Start</td>
                {@render timeInfo(activeHoliday.startDate)}
            </tr>
            <tr>
                <td class="label">End</td>
                {@render timeInfo(activeHoliday.endDate)}
            </tr>
        </tbody>
    </table>

    {#if dropStats?.total > 0}
        <ProgressBar title="Drops" have={dropStats.have} total={dropStats.total} />
    {/if}

    {#if vendorStats?.total > 0}
        <ProgressBar title="Vendors" have={vendorStats.have} total={vendorStats.total} />
    {/if}

    {#if achievementStats?.total > 0}
        <ProgressBar
            title="Achievements"
            have={achievementStats.have}
            total={achievementStats.total}
        />
    {/if}
</div>
