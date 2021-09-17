<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import Fa from 'svelte-fa'

    import {covenantSlugMap} from '@/data/covenant'
    import {farmType} from '@/data/farm'
    import {userStore} from '@/stores'
    import type {FarmDataFarm} from '@/types/data'
    import type {FarmStatus} from '@/utils/get-farm-status'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let farm: FarmDataFarm
    export let status: FarmStatus
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
            {#each farm.drops as drop, dropIndex}
                <tr class:success={!status.drops[dropIndex].need}>
                    <td class="type status-{status.drops[dropIndex].need ? 'fail' : 'success'}">
                        {#if drop.type === 'transmog' && drop.limit?.[0] && drop.limit?.[0] !== 'covenant'}
                            <Fa fw icon={farmType[drop.limit[0]]} />
                        {:else}
                            <Fa fw icon={farmType[drop.type]} />
                        {/if}
                    </td>
                    <td class="name" class:status-success={!status.drops[dropIndex].need}>{drop.name}</td>
                    <td class="limit">
                        {#if drop.limit?.length > 0}
                            {drop.limit[1]}
                        {:else if drop.type === 'transmog'}
                            cosmetic
                        {/if}
                    </td>
                </tr>

                {#if status.drops[dropIndex].need && status.drops[dropIndex].characterIds.length > 0}
                    <tr>
                        <td></td>
                        <td class="characters" colspan="2">
                            {#each sortBy(
                                status.drops[dropIndex].characterIds
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
