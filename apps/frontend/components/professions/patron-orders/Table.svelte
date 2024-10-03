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

<style lang="scss">
    th {
        text-align: left;
    }
    .header {
        align-items: stretch;
        display: flex;
        height: 1.5rem;
    }
    .header-spacer {
        width: 27.7rem; 
    }
    .rewards {
        text-align: center;
        width: 10.1rem;
    }
    .costs {
        flex-grow: 1;
        text-align: center;
    }
</style>

{#if profession}
    <CharacterTable {filterFunc} showEmpty={false}>
        <CharacterTableHead slot="head">
            <svelte:fragment slot="headText">
                <WowthingImage
                    name={imageStrings[profession.slug]}
                    size={20}
                    border={1}
                />
                {profession.name.split('|')[0]}
            </svelte:fragment>

            <th>
                <div class="header">
                    <div class="header-spacer border-right"></div>
                    <div class="rewards border-right">Rewards</div>
                    <div class="costs">Costs</div>
                </div>
            </th>
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            <TableCell
                {character}
                {commodities}
                {profession}
            />
        </svelte:fragment>
    </CharacterTable>
{/if}
