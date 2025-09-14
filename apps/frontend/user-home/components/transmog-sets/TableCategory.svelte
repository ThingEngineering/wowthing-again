<script lang="ts">
    import { classByArmorType } from '@/data/character-class';
    import { Constants } from '@/data/constants';
    import { transmogSets } from '@/data/transmog';
    import { iconLibrary, uiIcons } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { userStore } from '@/stores';
    import { transmogSetsState } from '@/stores/local-storage';
    import getPercentClass from '@/utils/get-percent-class';
    import getTransmogSpan from '@/utils/get-transmog-span';
    import { TransmogSetData } from '@/types';
    import { lazyState } from '@/user-home/state/lazy';
    import getFilteredSets from '@/utils/transmog/get-filtered-sets';
    import type { ManualDataTransmogCategory, ManualDataTransmogGroup } from '@/types/data/manual';

    import { tradingPostKeys } from './data';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import CovenantIcon from '@/shared/components/images/CovenantIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import TableSet from './TableSet.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        anyClasses: boolean;
        category: ManualDataTransmogCategory;
        skipClasses: Record<string, boolean | number>;
        slugs: string[];
        startSpacer: boolean;
    };
    let { anyClasses, category, skipClasses, slugs, startSpacer }: Props = $props();

    let categoryPercent = $derived(
        lazyState.transmog.stats[`${slugs[0]}--${category.slug}`].percent
    );
    let setKey = $derived(slugs.join('--'));

    const getTransmogSets = function (group: ManualDataTransmogGroup): TransmogSetData[] {
        if (group.type === 'multi') {
            return Object.keys(group.data).map(
                (_, index) => new TransmogSetData(index.toString(), index)
            );
        } else {
            return transmogSets[group.type].sets;
        }
    };

    const getPercent = function (groupIndex: number, setIndex: number): number {
        let key: string;
        if (setIndex >= 0) {
            key = `${slugs[0]}--${category.slug}--${groupIndex}--${setIndex}`;
        } else {
            key = `${slugs[0]}--${category.slug}--${groupIndex}`;
        }
        return lazyState.transmog.stats[key]?.percent;
    };

    const fakeArmorSpan = function (type: string): number {
        const fakeGroup: ManualDataTransmogGroup = { data: {}, name: '', sets: [], type: 'armor' };
        const fakeSet: TransmogSetData = {
            span: anyClasses
                ? classByArmorType[[null, 'cloth', 'leather', 'mail', 'plate'].indexOf(type)].length
                : 1,
            type,
        };
        return getTransmogSpan(fakeGroup, fakeSet, skipClasses);
    };

    const completionistReady = function (
        group: ManualDataTransmogGroup,
        _setIndex: number
    ): boolean {
        return group.data?.[transmogSets[group.type].sets[0].type]?.every(
            (groupData) => groupData === null || !!groupData.transmogSetId
        );
    };

    function getMultiKeys(group: ManualDataTransmogGroup) {
        if (category.name === 'Trading Post') {
            return tradingPostKeys;
        } else {
            return Object.keys(group.data).map((_, index) => (index + 1).toString());
        }
    }
</script>

<style lang="scss">
    .spacer {
        td {
            background: var(--color-body-background) !important;
            border-left-width: 0 !important;
            border-right-width: 0 !important;
        }
    }

    .sticky {
        --image-border-width: 0;
        --image-margin-top: 0;

        td {
            background: var(--color-thing-background);
            position: sticky;
            top: 0;
            z-index: 1;
        }
        .icon {
            border-left: 1px solid var(--border-color);
        }
    }
    .category-name {
        font-size: 1.1rem;
        padding-left: 0.5rem;
    }
    .icon {
        padding: 0.1rem;
        position: relative;
        text-align: center;
        width: calc(46px + 0.2rem);

        span {
            bottom: 0;
            padding: 1px 0.2rem;
            pointer-events: none;
        }
    }
    .faded {
        opacity: 0.5;
    }
    .name {
        --width: 18rem;

        position: relative;

        .flex-wrapper {
            --image-margin-top: -6px;

            :global(.text-overflow) {
                min-width: 0;
            }
            .has-transmog-set-id {
                color: var(--color-shrug);
            }
        }

        span:last-child {
            margin-left: auto;
        }
    }
    .highlight {
        background-color: var(--color-highlight-background);
        color: #8ff1eb;
        padding-bottom: 0.2rem;
        padding-top: 0.2rem;
    }
    .tag {
        color: var(--color-success);
    }
    .percent {
        position: absolute;
        right: 0.5rem;
        word-spacing: -0.2ch;
    }
    .percent-cell {
        --width: 2.8rem;

        border-right: 1px solid var(--border-color);
        text-align: right;
        word-spacing: -0.2ch;
    }
    .group .percent-cell {
        background-color: var(--color-highlight-background);
    }
</style>

{#if startSpacer}
    <tr class="spacer">
        <td colspan="100">&nbsp;</td>
    </tr>
{/if}

{#each category.groups as group, groupIndex (group)}
    {@const currentType = transmogSets[group.type].type}
    {@const showPercent = !isNaN(categoryPercent)}
    {@const groupKey = `${setKey}--${category.slug}--${groupIndex}`}
    {@const isExpanded = $transmogSetsState.collapsedCategories[groupKey] !== true}
    {#if groupIndex === 0 || (transmogSets[category.groups[groupIndex - 1].type].type !== currentType && [transmogSets[category.groups[groupIndex - 1].type].type, currentType].indexOf('covenant') >= 0)}
        {#if groupIndex > 0 && category.groups[groupIndex - 1].name !== group.name}
            <tr class="spacer">
                <td colspan="100">&nbsp;</td>
            </tr>
        {/if}

        <tr class="sticky">
            <td class="category-name" colspan="2">
                {category.name}

                {#if showPercent}
                    <span class="drop-shadow percent {getPercentClass(categoryPercent)}">
                        {Math.floor(categoryPercent).toFixed(0)} %
                    </span>
                {/if}
            </td>

            {#if currentType === 'covenant'}
                {#each transmogSets[group.type].sets as tsd}
                    <td class="icon">
                        <CovenantIcon size={40} covenantName={tsd.subType} />
                    </td>
                {/each}
                <td class="icon" colspan="100"></td>
            {:else if currentType === 'armor'}
                {#if !skipClasses['cloth']}
                    {@const span = fakeArmorSpan('cloth')}
                    <td class="icon" colspan={span}>
                        <WowthingImage
                            name={Constants.icons.armorCloth}
                            size={40}
                            tooltip="Cloth"
                        />
                        <span class="abs-center pill">C</span>
                    </td>
                {/if}

                {#if !skipClasses['leather']}
                    {@const span = fakeArmorSpan('leather')}
                    <td class="icon" colspan={span}>
                        <WowthingImage
                            name={Constants.icons.armorLeather}
                            size={40}
                            tooltip="Leather"
                        />
                        <span class="abs-center pill">L</span>
                    </td>
                {/if}

                {#if !skipClasses['mail']}
                    {@const span = fakeArmorSpan('mail')}
                    <td class="icon" colspan={span}>
                        <WowthingImage name={Constants.icons.armorMail} size={40} tooltip="Mail" />
                        <span class="abs-center pill">M</span>
                    </td>
                {/if}

                {#if !skipClasses['plate']}
                    {@const span = fakeArmorSpan('plate')}
                    <td class="icon" colspan={span}>
                        <WowthingImage
                            name={Constants.icons.armorPlate}
                            size={40}
                            tooltip="Plate"
                        />
                        <span class="abs-center pill">P</span>
                    </td>
                {/if}
            {:else if currentType === 'multi'}
                {#each getMultiKeys(group) as key}
                    <td class="icon">
                        <ParsedText text={key} />
                    </td>
                {/each}
            {:else if !anyClasses || currentType === 'all'}
                <td class="icon" colspan="100">
                    <WowthingImage name="spell/154611" size={40} tooltip="Plate" />
                    <span class="abs-center pill">All</span>
                </td>
            {:else}
                {#if !skipClasses['mage']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={8} />
                    </td>
                {/if}
                {#if !skipClasses['priest']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={5} />
                    </td>
                {/if}
                {#if !skipClasses['warlock']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={9} />
                    </td>
                {/if}
                {#if !skipClasses['demon-hunter']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={12} />
                    </td>
                {/if}
                {#if !skipClasses['druid']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={11} />
                    </td>
                {/if}
                {#if !skipClasses['monk']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={10} />
                    </td>
                {/if}
                {#if !skipClasses['rogue']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={4} />
                    </td>
                {/if}
                {#if !skipClasses['evoker']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={13} />
                    </td>
                {/if}
                {#if !skipClasses['hunter']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={3} />
                    </td>
                {/if}
                {#if !skipClasses['shaman']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={7} />
                    </td>
                {/if}
                {#if !skipClasses['death-knight']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={6} />
                    </td>
                {/if}
                {#if !skipClasses['paladin']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={2} />
                    </td>
                {/if}
                {#if !skipClasses['warrior']}
                    <td class="icon">
                        <ClassIcon border={0} size={40} classId={1} />
                    </td>
                {/if}
            {/if}
        </tr>
    {/if}

    {#if groupIndex === 0 || category.groups[groupIndex - 1].name !== group.name}
        {@const groupPercent = getPercent(groupIndex, -1)}
        <tr class="group">
            <td class="percent-cell">
                {#if showPercent && !isNaN(groupPercent)}
                    <span class="drop-shadow {getPercentClass(groupPercent)}">
                        {Math.floor(groupPercent).toFixed(0)} %
                    </span>
                {/if}
            </td>
            <td class="name highlight" colspan="100">
                <IconifyIcon
                    icon={isExpanded ? uiIcons.minus : uiIcons.plus}
                    on:click={() => ($transmogSetsState.collapsedCategories[groupKey] = isExpanded)}
                    tooltip={isExpanded ? 'Collapse this group' : 'Expand this group'}
                />

                {#if group.tag}
                    <span class="tag">
                        [{group.tag}]
                    </span>
                {/if}

                {group.name}
            </td>
        </tr>
    {/if}

    {#if isExpanded}
        {#each getFilteredSets(settingsState.value, $userStore, group) as [setShow, setName], setIndex}
            {#if setShow}
                {@const setPercent = getPercent(groupIndex, setIndex)}
                <tr class:faded={setName.endsWith('*')}>
                    <td class="percent-cell">
                        {#if showPercent && !isNaN(setPercent)}
                            <span class="drop-shadow {getPercentClass(setPercent)}">
                                {Math.floor(setPercent).toFixed(0)} %
                            </span>
                        {/if}
                    </td>

                    <td class="name">
                        <div class="flex-wrapper">
                            <ParsedText cls="text-overflow" text={setName.replace(/[*$]/, '')} />

                            {#if completionistReady(group, setIndex)}
                                <span
                                    class="has-transmog-set-id"
                                    use:basicTooltip={'Uses a Blizzard transmog set'}
                                >
                                    <IconifyIcon icon={iconLibrary.gameStaryu} scale="0.8" />
                                </span>
                            {/if}
                        </div>
                    </td>

                    {#each getTransmogSets(group) as transmogSet (`set--${setKey}--${setName}--${transmogSet.type}`)}
                        {#if !skipClasses[transmogSet.type]}
                            <TableSet
                                set={group.data?.[transmogSet.type]?.[setIndex]}
                                setKey={`${slugs[0]}--${category.slug}--${groupIndex}--${setIndex}--${transmogSet.type}`}
                                setTitle={setName}
                                span={anyClasses
                                    ? getTransmogSpan(group, transmogSet, skipClasses)
                                    : transmogSet.type === 'all'
                                      ? 100
                                      : 1}
                                subType={transmogSet.subType}
                            />
                        {/if}
                    {/each}
                </tr>
            {/if}
        {/each}
    {/if}
{/each}
