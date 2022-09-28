<script lang="ts">
    import { transmogSets } from '@/data/transmog-sets'
    import { userTransmogStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import getPercentClass from '@/utils/get-percent-class'
    import getTransmogSpan from '@/utils/get-transmog-span'
    import getFilteredSets from '@/utils/transmog/get-filtered-sets'
    import type { ManualDataTransmogCategory } from '@/types/data/manual'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import CovenantIcon from '@/components/images/CovenantIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import TableSet from './SetsTableSet.svelte'

    export let category: ManualDataTransmogCategory
    export let skipClasses: Record<string, boolean>
    export let slugs: string[]
    export let startSpacer = false

    let categoryPercent: number
    let getPercent: (groupIndex: number, setIndex: number) => number
    let setKey: string
    $: {
        const categoryHas = $userTransmogStore.data.stats[`${slugs[0]}--${category.slug}`]
        categoryPercent = categoryHas.have / categoryHas.total * 100
        setKey = slugs.join('--')

        getPercent = function(groupIndex: number, setIndex: number): number {
            let key: string
            if (setIndex >= 0) {
                key = `${slugs[0]}--${category.slug}--${groupIndex}--${setIndex}`
            }
            else {
                key = `${slugs[0]}--${category.slug}--${groupIndex}`
            }
            const hasData = $userTransmogStore.data.stats[key]
            return hasData ? hasData.have / hasData.total * 100 : 0
        }
    }
</script>

<style lang="scss">
    .spacer {
        td {
            background: $body-background !important;
            border-left-width: 0 !important;
            border-right-width: 0 !important;
        }
    }

    .sticky {
        --image-border-width: 0;
        --image-margin-top: 0;

        td {
            background: $thing-background;
            position: sticky;
            top: 0;
            z-index: 1;
        }
        .icon {
            border-left: 1px solid $border-color;
        }
    }
    .category-name {
        font-size: 1.1rem;
        padding-left: 0.5rem;
    }
    .icon {
        padding: 0.1rem;
        text-align: center;
        width: calc(46px + 0.2rem);
    }
    .faded {
        opacity: 0.4;
    }
    .name {
        @include cell-width(15rem);

        position: relative;
    }
    .highlight {
        background-color: $highlight-background;
        color: #8ff1eb;
        padding-bottom: 0.2rem;
        padding-top: 0.2rem;
    }
    .tag {
        color: $colour-success;
    }
    .percent {
        position: absolute;
        right: 0.5rem;
        word-spacing: -0.2ch;
    }
    .percent-cell {
        @include cell-width(2.8rem);

        border-right: 1px solid $border-color;
        text-align: right;
        word-spacing: -0.2ch;
    }
    .group .percent-cell {
        background-color: $highlight-background;
    }
</style>

{#if startSpacer}
    <tr class="spacer">
        <td colspan="100">&nbsp;</td>
    </tr>
{/if}

{#each category.groups as group, groupIndex}
    {@const showPercent = !isNaN(categoryPercent)}
    {#if groupIndex === 0 || (
        transmogSets[category.groups[groupIndex-1].type].type !== transmogSets[group.type].type &&
        [transmogSets[category.groups[groupIndex-1].type].type, transmogSets[group.type].type].indexOf('covenant') >= 0
    )
    }
        {#if groupIndex > 0 && category.groups[groupIndex-1].name !== group.name}
            <tr class="spacer">
                <td colspan="100">&nbsp;</td>
            </tr>
        {/if}

        <tr class="sticky">
            <td class="category-name" colspan="{showPercent ? 2 : 1}">
                {category.name}
                
                {#if showPercent}
                    <span class="drop-shadow percent {getPercentClass(categoryPercent)}">
                        {Math.floor(categoryPercent).toFixed(0)} %
                    </span>
                {/if}
            </td>

            {#if transmogSets[group.type].type === 'covenant'}
                {#each transmogSets[group.type].sets as tsd}
                    <td class="icon">
                        <CovenantIcon size={40} covenantName={tsd.subType} />
                    </td>
                {/each}
                <td class="icon" colspan="7"></td>

            {:else}
                {#if !skipClasses['mage']}
                    <td class="icon">
                        <ClassIcon size={40} classId={8} />
                    </td>
                {/if}
                {#if !skipClasses['priest']}
                    <td class="icon">
                        <ClassIcon size={40} classId={5} />
                    </td>
                {/if}
                {#if !skipClasses['warlock']}
                    <td class="icon">
                        <ClassIcon size={40} classId={9} />
                    </td>
                {/if}
                {#if !skipClasses['demon-hunter']}
                    <td class="icon">
                        <ClassIcon size={40} classId={12} />
                    </td>
                {/if}
                {#if !skipClasses['druid']}
                    <td class="icon">
                        <ClassIcon size={40} classId={11} />
                    </td>
                {/if}
                {#if !skipClasses['monk']}
                    <td class="icon">
                        <ClassIcon size={40} classId={10} />
                    </td>
                {/if}
                {#if !skipClasses['rogue']}
                    <td class="icon">
                        <ClassIcon size={40} classId={4} />
                    </td>
                {/if}
                {#if !skipClasses['hunter']}
                    <td class="icon">
                        <ClassIcon size={40} classId={3} />
                    </td>
                {/if}
                {#if !skipClasses['shaman']}
                    <td class="icon">
                        <ClassIcon size={40} classId={7} />
                    </td>
                {/if}
                {#if !skipClasses['death-knight']}
                    <td class="icon">
                        <ClassIcon size={40} classId={6} />
                    </td>
                {/if}
                {#if !skipClasses['paladin']}
                    <td class="icon">
                        <ClassIcon size={40} classId={2} />
                    </td>
                {/if}
                {#if !skipClasses['warrior']}
                    <td class="icon">
                        <ClassIcon size={40} classId={1} />
                    </td>
                {/if}
            {/if}
        </tr>
    {/if}

    {#if groupIndex === 0 || category.groups[groupIndex-1].name !== group.name}
        <tr class="group">
            {#if showPercent}
                <td class="percent-cell">
                    <span class="drop-shadow {getPercentClass(getPercent(groupIndex, -1))}">
                        {Math.floor(getPercent(groupIndex, -1)).toFixed(0)} %
                    </span>
                </td>
            {/if}
            <td class="name highlight" colspan="13">
                {#if group.tag}
                    <span class="tag">
                        [{group.tag}]
                    </span>
                {/if}

                {group.name}
            </td>
        </tr>
    {/if}

    {#each getFilteredSets($settingsData, $userTransmogStore.data, group) as [setShow, setName], setIndex}
        {#if setShow}
            <tr class:faded={setName.endsWith('*')}>
                {#if showPercent}
                    <td class="percent-cell">
                        <span class="drop-shadow {getPercentClass(getPercent(groupIndex, setIndex))}">
                            {Math.floor(getPercent(groupIndex, setIndex)).toFixed(0)} %
                        </span>
                    </td>
                {/if}
                <td class="name">
                    &ndash; <ParsedText text={setName.replace('*', '')} />
                </td>

                {#each transmogSets[group.type].sets as transmogSet (`set--${setKey}--${setName}--${transmogSet.type}`)}
                    {#if !skipClasses[transmogSet.type]}
                        <TableSet
                            set={group.data?.[transmogSet.type]?.[setIndex]}
                            span={getTransmogSpan(group, transmogSet, skipClasses)}
                            subType={transmogSet.subType}
                        />
                    {/if}
                {/each}
            </tr>
        {/if}
    {/each}
{/each}
