<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { itemStore, staticStore } from '@/stores'
    import type { Profession } from '@/enums/profession'
    import type { Character } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ProfessionIcon from '@/shared/images/ProfessionIcon.svelte'

    export let character: Character
    export let reputationId: number
    export let zoneData: {
        have: boolean
        itemId: number
        profession: Profession
        source?: string
    }[]
    export let zoneName: string

    $: characterRenown = reputationId ? Math.floor((character.reputations?.[reputationId] ?? 0) / 2500) : 0
</script>

<style lang="scss">
    .profession {
        --image-border-width: 1px;

        padding: 0.2rem;
        text-align: center;
        width: 1.8rem;
    }
    .have {
        padding: 0.2rem;
        text-align: center;
        width: 2rem;
    }
    .name {
        text-align: left;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{zoneName}</h5>
    <table class="table-striped">
        <tbody>
            {#each zoneData as { have, itemId, profession, source }}
                <tr>
                    <td class="profession">
                        <ProfessionIcon id={profession} />
                    </td>
                    <td
                        class="have"
                        class:status-success={have}
                        class:status-fail={!have}
                    >
                        <IconifyIcon icon={have ? iconStrings.yes : iconStrings.no} />
                    </td>
                    
                    {#if itemId > 0}
                        {@const item = $itemStore.items[itemId]}
                        <td class="name quality{item.quality}">{item.name}</td>
                    {:else}
                        <td class="name quality5">Profession Master</td>
                    {/if}

                    {#if source && source !== 'undefined'}
                        {@const renown = parseInt(source.split(' ')[1])}
                        {#if renown}
                            <td
                                class="source"
                                class:status-fail={renown > characterRenown}
                                class:status-success={renown <= characterRenown}
                            >R {renown}</td>
                        {/if}
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>

    {#if reputationId}
        <div class="bottom">
            <span>
                {$staticStore.reputations[reputationId].name}
                {characterRenown}
            </span>
        </div>
    {/if}
</div>
