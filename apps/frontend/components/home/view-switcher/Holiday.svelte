<script lang="ts">
    import { type FancyHoliday } from '@/data/holidays';
    import { timeState } from '@/shared/state/time.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { DbThingType } from '@/shared/stores/db/enums';
    import { DbDataThing } from '@/shared/stores/db/types';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { UserCount } from '@/types/user-count';
    import { everythingData } from '@/user-home/components/everything/data';
    import { lazyState } from '@/user-home/state/lazy';
    import { userState } from '@/user-home/state/user';
    import { toNiceDuration } from '@/utils/formatting';
    import getPercentClass from '@/utils/get-percent-class';
    import { type ActiveHoliday } from '@/user-home/state/activeHolidays.svelte';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import HolidayTooltip from './HolidayTooltip.svelte';

    type Props = { activeHoliday: ActiveHoliday; fancyHoliday: FancyHoliday };
    let { activeHoliday, fancyHoliday }: Props = $props();

    // future => time until start, current => time until end
    let remainingTime = $derived.by(() =>
        activeHoliday.soon
            ? activeHoliday.startDate.diff(timeState.slowTime).toMillis()
            : activeHoliday.endDate.diff(timeState.slowTime).toMillis()
    );
    let everything = $derived(everythingData[fancyHoliday.everything]);

    let dropStats = $derived(lazyState.everything.drops[fancyHoliday.everything]?.stats);
    let vendorStats = $derived(lazyState.vendors.stats[(everything?.vendorsKey || []).join('--')]);

    let achievementStats = $derived.by(() => {
        if (everything?.achievementsKey?.length > 0) {
            let cat = wowthingData.achievements.categories?.find(
                (cat) => cat?.slug === everything.achievementsKey[0]
            );
            for (let i = 1; i < everything.achievementsKey.length; i++) {
                cat = cat?.children?.find((cat) => cat?.slug === everything.achievementsKey[i]);
            }
            return userState.achievements.categories[cat?.id];
        }
    });

    let { farms, stats } = $derived.by(() => {
        const farms: { farm: DbDataThing; status: boolean }[] = [];
        const stats = new UserCount();

        if (dropStats) {
            stats.have += dropStats.overall.have;
            stats.total += dropStats.overall.total;
        }

        if (vendorStats) {
            stats.have += vendorStats.have;
            stats.total += vendorStats.total;
        }

        if (achievementStats) {
            stats.have += achievementStats.have;
            stats.total += achievementStats.total;
        }

        if (dropStats && dropStats.overall.percent < 100) {
            const results = wowthingData.db.search({
                tags: [everything.tag],
            });
            for (const result of results) {
                // farmable things
                if (result.type === DbThingType.Item || result.type === DbThingType.Npc) {
                    // TODO: handle per-character?
                    if (result.accountWide && result.resetType) {
                        const status = userState.general.activeCharacters.some((char) =>
                            char.hasCompletedQuest(result.trackingQuestId, result.resetType)
                        );
                        farms.push({
                            farm: result,
                            status,
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
            <code>{toNiceDuration(remainingTime, { maxDays: 7, useNbsp: false })}</code>
        </span>
    </div>
{/snippet}

{#if fancyHoliday.everything}
    <a
        href="#/everything/{fancyHoliday.everything}"
        class:soon={activeHoliday.startDate > timeState.slowTime}
        use:componentTooltip={{
            component: HolidayTooltip,
            propsFunc: () => ({
                activeHoliday,
                achievementStats,
                dropStats: dropStats?.overall,
                vendorStats,
            }),
        }}
    >
        {@render flexWrapper()}
    </a>
{:else}
    {@render flexWrapper()}
{/if}
