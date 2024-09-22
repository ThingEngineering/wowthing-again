<script lang="ts">
    import { imageStrings } from '@/data/icons';
    import type { StaticDataProfession } from '@/shared/stores/static/types'
    import type { Character } from '@/types';
    import type { CommodityData } from './auction-store';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import TableCell from './TableCell.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let commodities: CommodityData;
    export let profession: StaticDataProfession;

    let filterFunc: (char: Character) => boolean
    $: {
        if (profession) {
            filterFunc = (char) => profession &&
                !!char.professions?.[profession.id] &&
                char.patronOrders?.[profession.id] !== undefined
        }
        else {
            filterFunc = () => false
        }
    }
</script>

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

            <th></th>
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            <TableCell
                {character}
                {commodities}
                {profession}
            />
        </svelte:fragment>

        <tr slot="emptyRow">
            <td colspan="999">You have no characters with this profession.</td>
        </tr>
    </CharacterTable>
{/if}
