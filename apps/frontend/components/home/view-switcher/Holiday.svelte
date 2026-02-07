<script lang="ts">
    import { type FancyHoliday } from '@/data/holidays';
    import { timeState } from '@/shared/state/time.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { DbResetType, DbThingType } from '@/shared/stores/db/enums';
    import { DbDataThing } from '@/shared/stores/db/types';
    import { UserCount } from '@/types/user-count';
    import { everythingData } from '@/user-home/components/everything/data';
    import { lazyState } from '@/user-home/state/lazy';
    import { userState } from '@/user-home/state/user';
    import { toNiceDuration } from '@/utils/formatting';
    import getPercentClass from '@/utils/get-percent-class';
    import { type ActiveHoliday } from '@/user-home/state/activeHolidays.svelte';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    type Props = { activeHoliday: ActiveHoliday; fancyHoliday: FancyHoliday };
    let { activeHoliday, fancyHoliday }: Props = $props();

    // future => time until start, current => time until end
    let remainingTime = $derived.by(() =>
        activeHoliday.soon
            ? activeHoliday.startDate.diff(timeState.slowTime).toMillis()
            : activeHoliday.endDate.diff(timeState.slowTime).toMillis()
    );
    let everything = $derived(everythingData[fancyHoliday.everything]);

    let { farms, stats } = $derived.by(() => {
        const farms: { farm: DbDataThing; status: boolean }[] = [];
        const stats = new UserCount();

        const { stats: dropStats } = lazyState.everything.drops[fancyHoliday.everything] || {};
        if (dropStats) {
            stats.have += dropStats.overall.have;
            stats.total += dropStats.overall.total;
        }

        const vendorStats = lazyState.vendors.stats[everything.vendorsKey.join('--')];
        if (vendorStats) {
            stats.have += vendorStats.have;
            stats.total += vendorStats.total;
        }

        if (everything.achievementsKey?.length > 0) {
            let cat = wowthingData.achievements.categories?.find(
                (cat) => cat?.slug === everything.achievementsKey[0]
            );
            for (let i = 1; i < everything.achievementsKey.length; i++) {
                cat = cat?.children?.find((cat) => cat?.slug === everything.achievementsKey[i]);
            }
            stats.have += userState.achievements.categories[cat?.id]?.have || 0;
            stats.total += userState.achievements.categories[cat?.id]?.total || 0;
        }

        const results = wowthingData.db.search({
            tags: [everything.tag],
        });
        for (const result of results) {
            // farmable things
            if (result.type === DbThingType.Item || result.type === DbThingType.Npc) {
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
