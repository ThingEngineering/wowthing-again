<script lang="ts">
    import mdiMessageBulleted from '@iconify/icons-mdi/message-bulleted'
    import sortBy from 'lodash/sortBy'

    import { dropType } from '@/data/farm'
    import { userStore } from '@/stores'
    import type { DropStatus, FarmStatus } from '@/types'
    import type { ZoneMapDataDrop, ZoneMapDataFarm } from '@/types/data'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let farm: ZoneMapDataFarm
    export let status: FarmStatus

    let sortedDrops: [ZoneMapDataDrop, DropStatus][]
    $: {
        const sigh: [ZoneMapDataDrop, DropStatus][] = []
        for (let dropIndex = 0; dropIndex < farm.drops.length; dropIndex++) {
            sigh.push([farm.drops[dropIndex], status.drops[dropIndex]])
        }

        sortedDrops = sortBy(sigh, (s) => !s[1].need)
    }

    const showCharacters = (dropStatus: DropStatus, nextDrop: [ZoneMapDataDrop, DropStatus]): boolean => {
        if (nextDrop) {
            // If they both have no valid characters, bail early
            if (!dropStatus.validCharacters && !nextDrop[1].validCharacters) {
                return false
            }

            // Compare this drop to the next one - if the character list is the same we don't need to show it
            const difference = new Set(dropStatus.characterIds)
            for (const characterId of nextDrop[1].characterIds) {
                if (difference.has(characterId)) {
                    difference.delete(characterId)
                }
                else {
                    difference.add(characterId)
                    break
                }
            }

            return difference.size > 0
        }
        else
        {
            return !dropStatus.validCharacters
                || dropStatus.characterIds.length > 0
                || dropStatus.completedCharacterIds.length > 0
        }
    }
</script>

<style lang="scss">
    .note {
        color: #00ccff;
        font-size: 0.95rem;
    }
    p.note {
        border-bottom: 1px solid $border-color;
        margin: 0;
        padding: 0.1rem 0.5rem 0.2rem 0.5rem;
    }
    .type {
        width: 1.6rem;
    }
    .name {
        padding-left: 0;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .limit {
        text-align: left;
        white-space: nowrap;
        word-spacing: -0.2ch;
    }
    .success {
        opacity: 0.7;
    }
    .characters {
        padding-left: 0;
        text-align: left;

        span {
            white-space: nowrap;

            &.completed {
                opacity: 0.7;
                text-decoration: line-through;
            }
        }

        span:not(:last-child) {
            margin-right: 0.3rem;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{farm.name}</h4>

    {#if farm.reset !== 'never'}
        <h5>{farm.reset} reset</h5>
    {/if}

    {#if farm.note}
        <p class="note">{farm.note}</p>
    {/if}

    <table class="table-tooltip-farm table-striped">
        <tbody>
            {#each sortedDrops as [drop, dropStatus], sortedIndex}
                <tr
                    class:success={!dropStatus.need || !dropStatus.validCharacters || dropStatus.skip}
                >
                    <td class="type status-{dropStatus.need ? 'fail' : 'success'}">
                        {#if drop.type === 'transmog' && drop.limit?.[0] && drop.limit?.[0] !== 'covenant'}
                            <IconifyIcon icon={dropType[drop.limit[0]]} />
                        {:else}
                            <IconifyIcon icon={dropType[drop.type]} />
                        {/if}
                    </td>
                    <td class="name" class:status-success={!dropStatus.need}>{drop.name}</td>
                    <td class="limit">
                        {#if drop.limit?.length > 0}
                            {drop.limit[1]}
                            {#if drop.limit.length > 2}
                                [ {drop.limit.slice(2).join(', ')} ]
                            {/if}
                        {:else if drop.type === 'transmog'}
                            cosmetic
                        {:else}
                            {drop.type}
                        {/if}
                    </td>
                </tr>

                {#if dropStatus.need && !dropStatus.skip}
                    {#if showCharacters(dropStatus, sortedDrops[sortedIndex+1])}
                        <tr>
                            <td></td>
                            <td class="characters" colspan="2">
                                {#each sortBy(
                                    dropStatus.characterIds
                                        .map(c => $userStore.data.characterMap[c]),
                                    c => c.name)
                                as character}
                                    <span class="class-{character.classId}">{character.name}</span>
                                {/each}
                                {#each sortBy(
                                    dropStatus.completedCharacterIds
                                        .map(c => $userStore.data.characterMap[c]),
                                    c => c.name)
                                as character}
                                    <span class="completed class-{character.classId}">{character.name}</span>
                                {/each}
                            </td>
                        </tr>
                    {:else if !dropStatus.validCharacters}
                        <tr class="status-fail">
                            <td></td>
                            <td class="characters" colspan="2">
                                &lt;no valid characters&gt;
                            </td>
                        </tr>
                    {/if}

                    {#if drop.note}
                        <tr>
                            <td></td>
                            <td class="characters note" colspan="2">
                                <IconifyIcon
                                        icon={mdiMessageBulleted}
                                        scale="0.9"
                                />
                                {drop.note}
                            </td>
                        </tr>
                    {/if}
                {/if}
            {/each}
        </tbody>
    </table>
</div>
