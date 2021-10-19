<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import Fa from 'svelte-fa'

    import {dropType} from '@/data/farm'
    import {userStore} from '@/stores'
    import type {FarmDataDrop, FarmDataFarm} from '@/types/data'
    import type {DropStatus, FarmStatus} from '@/utils/get-farm-status'

    export let farm: FarmDataFarm
    export let status: FarmStatus

    let sortedDrops: [FarmDataDrop, DropStatus][]
    $: {
        const sigh: [FarmDataDrop, DropStatus][] = []
        for (let dropIndex = 0; dropIndex < farm.drops.length; dropIndex++) {
            sigh.push([farm.drops[dropIndex], status.drops[dropIndex]])
        }

        sortedDrops = sortBy(sigh, (s) => !s[1].need)
    }
</script>

<style lang="scss">
    .note {
        border-bottom: 1px solid $border-color;
        color: #00ccff;
        font-size: 0.95rem;
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
    }
</style>

<div class="wowthing-tooltip">
    <h4>{farm.name}</h4>
    <h5>{farm.reset} reset</h5>

    {#if farm.note}
        <p class="note">{farm.note}</p>
    {/if}

    <table class="table-tooltip-farm table-striped">
        <tbody>
            {#each sortedDrops as [drop, dropStatus]}
                <tr class:success={!dropStatus.need}>
                    <td class="type status-{dropStatus.need ? 'fail' : 'success'}">
                        {#if drop.type === 'transmog' && drop.limit?.[0] && drop.limit?.[0] !== 'covenant'}
                            <Fa fw icon={dropType[drop.limit[0]]} />
                        {:else}
                            <Fa fw icon={dropType[drop.type]} />
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

                {#if dropStatus.need && dropStatus.characterIds.length > 0}
                    <tr>
                        <td></td>
                        <td class="characters" colspan="2">
                            {#each sortBy(
                                dropStatus.characterIds
                                    .map(c => $userStore.data.characterMap[c]),
                                c => c.name) as character, characterIndex}
                                {characterIndex > 0 ? ', ' : ''}
                                <span class="class-{character.classId}">{character.name}</span>
                            {/each}
                        </td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>
