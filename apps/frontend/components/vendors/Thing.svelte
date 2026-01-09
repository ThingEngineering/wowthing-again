<script lang="ts">
    import { Faction } from '@/enums/faction';
    import { iconLibrary } from '@/shared/icons';
    import { lookupTypeIcons } from '@/shared/icons/mappings';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { lazyState } from '@/user-home/state/lazy';
    import { getClassesFromMask } from '@/utils/get-classes-from-mask';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ThingData } from '@/types/vendors';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import CurrencyLink from '@/shared/components/links/CurrencyLink.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        intersected?: boolean;
        skipFaction?: boolean;
        thing: ThingData;
    };
    let { intersected, skipFaction, thing }: Props = $props();

    let missing = $derived(
        (!browserState.current.vendors.highlightMissing && !thing.userHas) ||
            (browserState.current.vendors.highlightMissing && thing.userHas)
    );
</script>

<style lang="scss">
    .collection-object {
        min-height: 52px;
        width: 52px;
    }
    .collected-appearances {
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        color: var(--color-success);
        line-height: 1;
        padding: 0.1rem 0.2rem;
        pointer-events: none;
        position: absolute;
        top: 30px;
        right: 1px;
    }
    .costs {
        --image-border-width: 0;
        --image-margin-top: -4px;

        background: var(--color-highlight-background);
        display: flex;
        flex-direction: column;
        white-space: nowrap;

        :global(a) {
            text-align: right;
            width: 100%;
        }

        div {
            display: flex;
            font-size: 0.95rem;
            gap: 2px;
            line-height: 1.3;
            justify-content: flex-end;
        }
    }
    .icon {
        --image-border-radius: 50%;
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        width: 24px;
        pointer-events: none;
        position: absolute;
    }
    .icon-class {
        left: -2px;
        top: -1px;
    }
    .icon-class2 {
        left: 15px;
        top: -2px;
    }
    .icon-faction {
        left: -2px;
        top: 29px;
    }
    .stats {
        justify-content: center;
        display: flex;
        font-size: 0.85rem;
        gap: 3px;
        pointer-events: none;
        position: absolute;
        top: 36px;
        width: 100%;
        letter-spacing: -0.1ch;

        span:nth-child(2) {
            font-size: 0.7rem;
            line-height: 1.1;
        }
    }
</style>

{#snippet hoverIcon(icon)}
    <div class="icon icon-class quality1 drop-shadow">
        <IconifyIcon {icon} />
    </div>
{/snippet}

<div
    class="collection-object quality{thing.quality}"
    class:missing
    style:height={!thing.userHas ? 52 + 20 * thing.item.sortedCosts.length + 'px' : null}
>
    {#if intersected}
        {@const teachesTransmog = wowthingData.items.teachesTransmog[thing.item.id]}
        {@const item = wowthingData.items.items[thing.item.id]}
        {@const classes = getClassesFromMask(item?.classMask || 0)}
        {@const requiredProfession = wowthingData.static.requiredProfessionByItemId.get(
            thing.item.id
        )}
        {@const specIds = wowthingData.items.specOverrides[thing.item.id]}
        <WowheadLink
            id={thing.linkId}
            type={thing.linkType}
            extraParams={thing.extraParams}
            tooltip={thing.tooltip}
        >
            <WowthingImage name="{thing.linkType}/{thing.linkId}" size={48} border={2} />
        </WowheadLink>

        {#if thing.item.extraAppearances > 0}
            <div class="collected-appearances background-box drop-shadow">
                +{thing.item.extraAppearances}
            </div>
        {/if}

        {#if !skipFaction && thing.item.faction !== Faction.Both}
            <div class="icon icon-faction drop-shadow">
                <FactionIcon faction={thing.item.faction} border={2} size={20} useTooltip={false} />
            </div>
        {/if}

        {#if specIds?.length > 0 || thing.classId > 0 || classes?.length === 1}
            {@const classId = thing.classId || (classes?.length === 1 ? classes[0] : 0)}
            <div class="icon icon-class class-{classId} drop-shadow">
                {#if specIds?.length <= 2}
                    <SpecializationIcon border={2} size={20} specId={specIds[0]} />
                {:else if classId}
                    <ClassIcon border={2} size={20} {classId} useTooltip={false} />
                {/if}
            </div>

            {#if specIds?.length === 2}
                <div class="icon icon-class2 class-{thing.classId} drop-shadow">
                    <SpecializationIcon border={2} size={20} specId={specIds[1]} />
                </div>
            {/if}
        {/if}

        {#if thing.item.requirement && !thing.userHas}
            <div class="stats pill">{thing.item.requirement}</div>
        {:else if teachesTransmog}
            {@const setStats = lazyState.transmog.stats[`ensemble:${teachesTransmog}`]}
            {#if setStats}
                <div class="stats pill">
                    <span class={getPercentClass(setStats.percent)}>{setStats.have}</span>
                    <span class="quality0">/</span>
                    <span class={getPercentClass(setStats.percent)}>{setStats.total}</span>
                </div>
            {/if}
        {:else if thing.difficulty}
            <div class="stats pill quality1">
                {thing.difficulty}
            </div>
        {/if}

        {#if lookupTypeIcons[thing.lookupType]}
            {@render hoverIcon(lookupTypeIcons[thing.lookupType])}
        {:else if requiredProfession}
            <div class="icon icon-class drop-shadow">
                <ProfessionIcon border={2} size={20} id={requiredProfession} />
            </div>
        {:else if (thing.bonusIds || []).includes(999999)}
            <div class="icon icon-class status-shrug drop-shadow">
                <IconifyIcon icon={iconLibrary.gameDiceRandom} />
            </div>
        {/if}

        {#if thing.userHas}
            <CollectedIcon />
        {/if}

        {#if !thing.userHas || browserState.current.vendors.showCollectedPrices}
            <div class="costs quality1">
                {#each thing.item.sortedCosts as [costType, costId, costValue]}
                    <div>
                        <CurrencyLink
                            currencyId={costType === 'currency' ? costId : undefined}
                            itemId={costType === 'item' ? costId : undefined}
                        >
                            {costValue}
                            <WowthingImage name="{costType}/{costId}" size={16} border={0} />
                        </CurrencyLink>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>
