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
    import { everythingData } from '@/user-home/components/everything/data';

    type Props = { fancyHoliday: FancyHoliday };
    let { fancyHoliday }: Props = $props();

    let activeHoliday = $derived(
        holidayIds[fancyHoliday.holiday]
            .map((id) => activeHolidays.value[`h${id}`])
            .find((h) => !!h)
    );
    // future => time until start, current => time until end
    let remainingTime = $derived.by(() =>
        activeHoliday.soon
            ? activeHoliday.startDate.diff(timeState.slowTime).toMillis()
            : activeHoliday.endDate.diff(timeState.slowTime).toMillis()
    );
    let everything = $derived(everythingData[fancyHoliday.everything]);

    let snapshot = $derived.by(() => snapshotStateForUserHasLookup());
    let { farms, stats } = $derived.by(() => {
        const farms: { farm: DbDataThing; status: boolean }[] = [];
        const stats = new UserCount();

        const vendorStats = lazyState.vendors.stats[everything.vendorsKey.join('--')];
        if (vendorStats) {
            stats.have += vendorStats.have;
            stats.total += vendorStats.total;
        }

        const results = wowthingData.db.search({
            tags: [everything.tag],
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
    a,
    .flex-wrapper {
        --border-color: rgb(105, 245, 245);

        color: var(--color-body-text);
        gap: 0.4rem;

        &.soon {
            filter: grayscale(50%);
            opacity: 0.9;
        }
    }
    code {
        vertical-align: 0;
        word-spacing: -0.5ch;
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
        // font-size: 0.9rem;
        // word-spacing: -0.7ch;
    }
</style>

{#snippet flexWrapper()}
    <div class="flex-wrapper" class:soon={activeHoliday.startDate > timeState.slowTime}>
        <span class="farms">
            {#each farms as { farm, status } (farm)}
                <ParsedText
                    cls={status ? 'status-success' : 'status-fail'}
                    text={status ? ':starFull:' : ':starEmpty:'}
                />
            {/each}
        </span>

        <span>{fancyHoliday.shortName}</span>

        <code class="stats {getPercentClass(stats.percent)}">{stats.have}/{stats.total}</code>
        <span class="remaining">
            {activeHoliday.soon ? 'starts ' : 'ends '}
            <code>{toNiceDuration(remainingTime, false, 7)}</code>
        </span>
    </div>
{/snippet}

{#if fancyHoliday.everything}
    <a
        href="#/everything/{fancyHoliday.everything}"
        class:soon={activeHoliday.startDate > timeState.slowTime}
    >
        {@render flexWrapper()}
    </a>
{:else}
    {@render flexWrapper()}
{/if}
