<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { settingsStore } from '@/shared/stores/settings';
    import type { StaticDataProfession } from '@/shared/stores/static/types'
    import type { Character } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import Profession from './TableProfession.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let profession: StaticDataProfession

    let filterFunc: (char: Character) => boolean
    $: {
        if (profession) {
            filterFunc = (char) => !!char.professions?.[profession.id]
        }
        else {
            filterFunc = () => false
        }
    }
</script>

<style lang="scss">
    .profession-head {
        padding: 0.3rem;
    }
    td,th {
        @include cell-width(4.5rem);
        
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if profession}
    <CharacterTable {filterFunc}>
        <CharacterTableHead slot="head">
            <svelte:fragment slot="headText">
                <WowthingImage
                    name={imageStrings[profession.slug]}
                    size={20}
                    border={1}
                />
                {profession.name.split('|')[0]}
            </svelte:fragment>

            {#if profession.slug === 'archaeology'}
                <th class="profession-head">Ugh</th>
            {:else}
                {#each settingsStore.expansions as expansion}
                    <th class="profession-head">{expansion.shortName}</th>
                {/each}
            {/if}
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            {#each settingsStore.expansions as expansion}
                <Profession
                    primaryId={profession.id}
                    subId={profession.expansionSubProfession[expansion.id]?.id}
                    {character}
                />
            {/each}
        </svelte:fragment>

        <tr slot="emptyRow">
            <td colspan="999">You have no characters with this profession.</td>
        </tr>
    </CharacterTable>
{/if}
