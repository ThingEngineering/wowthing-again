<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { holidayIds, type FancyHoliday } from '@/data/holidays';
    import { DbResetType, DbThingType } from '@/shared/stores/db/enums';
    import { DbDataThing, thingContentTypeToRewardType } from '@/shared/stores/db/types';
    import { UserCount } from '@/types';
    import { lazyState } from '@/user-home/state/lazy';
    import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
    import { userHasLookup } from '@/utils/rewards/user-has-lookup';
    import { snapshotStateForUserHasLookup } from '@/utils/rewards/snapshot-state-for-user-has-lookup.svelte';
    import getPercentClass from '@/utils/get-percent-class';
    import { activeHolidays } from '@/user-home/state/activeHolidays.svelte';
    import { timeState } from '@/shared/state/time.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import { toNiceDuration } from '@/utils/formatting';
    import { userState } from '@/user-home/state/user';

    type Props = { fancyHoliday: FancyHoliday };
    let { fancyHoliday }: Props = $props();

    let activeHoliday = $derived(
        holidayIds[fancyHoliday.holiday]
            .map((id) => activeHolidays.value[`h${id}`])
            .find((h) => !!h)
    );
    let remainingTime = $derived.by(() =>
        activeHoliday.endDate.diff(timeState.slowTime).toMillis()
    );

    let snapshot = $derived.by(() => snapshotStateForUserHasLookup());
    let { farms, stats } = $derived.by(() => {
        const farms: { farm: DbDataThing; status: boolean }[] = [];
        const stats = new UserCount();

        const vendorStats = lazyState.vendors.stats[fancyHoliday.vendorsKey];
        if (vendorStats) {
            stats.have += vendorStats.have;
            stats.total += vendorStats.total;
        }

        const results = wowthingData.db.search({
            tags: [fancyHoliday.tag],
        });
        for (const result of results) {
            // farmable things
            if (result.type === DbThingType.Item || result.type === DbThingType.Npc) {
                console.log('other?', result);
                for (const content of result.contents) {
                    stats.total++;

                    const [lookupType, lookupId] = rewardToLookup(
                        thingContentTypeToRewardType[content.type],
                        content.id
                    );
                    const userHas = userHasLookup(snapshot, lookupType, lookupId, {});
                    if (userHas) {
                        stats.have++;
                    }
                }

                // TODO: handle per-character?
                if (result.accountWide) {
                    if (result.resetType === DbResetType.Daily) {
                        farms.push({
                            farm: result,

                            status: userState.quests.anyCharacterHasById.has(
                                result.trackingQuestId
                            ),
                        });
                    }
                }
            }
        }
        return { farms, stats };
    });
</script>

<style lang="scss">
    .flex-wrapper {
        --border-color: rgb(105, 245, 245);

        gap: 0.4rem;
    }
    .farms {
        margin: 0 -0.3rem;
    }
    .remaining {
        border-left: 1px solid oklch(from var(--border-color) calc(l - 0.3) c h);
        font-size: 0.9rem;
        padding-left: 0.4rem;
    }
    .stats {
        font-size: 0.9rem;
        word-spacing: -0.7ch;
    }
</style>

<div class="flex-wrapper">
    <span class="farms">
        {#each farms as { farm, status } (farm)}
            <ParsedText
                cls={status ? 'status-success' : 'status-fail'}
                text={status ? ':starFull:' : ':starEmpty:'}
            />
        {/each}
    </span>

    <span>{fancyHoliday.shortName}</span>

    <code class="stats {getPercentClass(stats.percent)}">{stats.have} / {stats.total}</code>
    <code class="remaining">{toNiceDuration(remainingTime, false)}</code>
</div>
