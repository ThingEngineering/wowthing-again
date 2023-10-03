<script lang="ts">
    import some from 'lodash/some'

    import { transmogSets } from '@/data/transmog'
    import { TransmogSetType } from '@/enums/transmog-set-type'
    import { userTransmogStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import type { ManualDataTransmogSetCategory } from '@/types/data/manual'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import TableSet from './TransmogSetsTableSet.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let category: ManualDataTransmogSetCategory
    export let skipClasses: Record<string, boolean|number>
    export let slugs: string[]
    export let startSpacer = false

    let anyClass: boolean
    let categoryPercent: number
    let getPercent: (groupIndex: number, setIndex: number) => number
    let setKey: string
    let showPercent: boolean
    let shownArmor: number
    let shownClass: number
    $: {
        anyClass = some(
            category.filteredGroups,
            (group) => group.type === TransmogSetType.Class ||
                some(group.sets, (set) => set.type === TransmogSetType.Class)
        )

        const categoryHas = $userTransmogStore.statsV2[`${slugs[0]}--${category.slug}`]
        categoryPercent = categoryHas.have / categoryHas.total * 100
        showPercent = !isNaN(categoryPercent)
        
        shownArmor = skipClasses['shownArmor'] as number
        shownClass = skipClasses['shownClass'] as number

        setKey = slugs.join('--')

        getPercent = function(groupIndex: number, setIndex: number): number {
            let key: string
            if (setIndex >= 0) {
                key = `${slugs[0]}--${category.slug}--${groupIndex}--${setIndex}`
            }
            else {
                key = `${slugs[0]}--${category.slug}--${groupIndex}`
            }
            const hasData = $userTransmogStore.statsV2[key]
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

            &.blank {
                border-bottom-width: 0;
                border-left: 1px solid $border-color;
                border-right-width: 0;
                border-top-width: 0;
            }
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
        opacity: 0.4;
    }
    .name {
        @include cell-width(15rem, $paddingLeft: 0.5rem);

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
    .group {
        .percent-cell {
            background-color: $highlight-background;
        }
    }
</style>

{#if startSpacer}
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

    {#if anyClass}
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
        {#if !skipClasses['evoker']}
            <td class="icon">
                <ClassIcon size={40} classId={13} />
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
    
    {:else}
        {#if !skipClasses['cloth']}
            <td class="icon">
                <WowthingImage
                    name="item/102289"
                    size={40}
                    tooltip="Cloth"
                />
                <span class="abs-center pill">C</span>
            </td>
        {/if}

        {#if !skipClasses['leather']}
            <td class="icon">
                <WowthingImage
                    name="item/102282"
                    size={40}
                    tooltip="Leather"
                />
                <span class="abs-center pill">L</span>
            </td>
        {/if}

        {#if !skipClasses['mail']}
            <td class="icon">
                <WowthingImage
                    name="item/102275"
                    size={40}
                    tooltip="Mail"
                />
                <span class="abs-center pill">M</span>
            </td>
        {/if}

        {#if !skipClasses['plate']}
            <td class="icon">
                <WowthingImage
                    name="item/102268"
                    size={40}
                    tooltip="Plate"
                />
                <span class="abs-center pill">P</span>
            </td>
        {/if}

        <td class="blank" colspan="100"></td>
    {/if}
</tr>

{#each category.filteredGroups as group, groupIndex}
    <tr class="group">
        <td class="percent-cell">
            <span class="drop-shadow {getPercentClass(getPercent(groupIndex, -1))}">
                {Math.floor(getPercent(groupIndex, -1)).toFixed(0)} %
            </span>
        </td>
        <td class="name highlight" colspan="{1 + (anyClass ? shownClass : shownArmor)}">
            {#if group.prefix}
                <span class="tag">
                    [{group.prefix}]
                </span>
            {/if}

            {group.name}
        </td>
    </tr>

    {#each group.filteredSets as set, setIndex}
        <tr class:faded={set.name.endsWith('*')}>
                <td class="percent-cell">
                    <span class="drop-shadow {getPercentClass(getPercent(groupIndex, setIndex))}">
                        {Math.floor(getPercent(groupIndex, setIndex)).toFixed(0)} %
                    </span>
                </td>

            <td class="name">
                &ndash; <ParsedText text={set.name.replace('*', '')} />
            </td>

            {#each transmogSets[group.type].sets as transmogSet (`set--${setKey}--${set.name}--${transmogSet.type}`)}
                {#if !skipClasses[transmogSet.type]}
                    <TableSet
                        {set}
                        span={1}
                        stats={$userTransmogStore.statsV2[`${slugs[0]}--${category.slug}--${groupIndex}--${setIndex}--${transmogSet.type}`]}
                        subType={transmogSet.subType}
                    />
                {/if}
            {/each}
        </tr>
    {/each}
{/each}
