<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { itemStore } from '@/stores'
    import type { Profession } from '@/enums'
    import type { Character } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ProfessionIcon from '@/components/images/ProfessionIcon.svelte'

    export let character: Character
    export let zoneData: {
        have: boolean
        itemId: number
        profession: Profession
    }[]
    export let zoneName: string
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
            {#each zoneData as { have, itemId, profession }}
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
                </tr>
            {/each}
        </tbody>
    </table>
</div>
