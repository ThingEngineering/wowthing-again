<script lang="ts">
    import { convertibleTypes } from './data'
    import { AppearanceModifier } from '@/enums/appearance-modifier'
    import { InventoryType } from '@/enums/inventory-type'
    import { uiIcons } from '@/shared/icons'
    import { lazyStore, settingsStore, userTransmogStore } from '@/stores'
    import type { ConvertibleCategory } from './types'
    import type { StaticDataCharacterClass } from '@/shared/stores/static/types'
    import type { Character } from '@/types'
    import type { ItemDataItem } from '@/types/data/item'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import CharacterItems from './CharacterItems.svelte';

    export let modifier: AppearanceModifier
    export let playerClass: StaticDataCharacterClass
    export let season: ConvertibleCategory

    $: data = $lazyStore.convertible[season.id][playerClass.id]

    $: filterFunc = function(char: Character): boolean {
        return char.level >= season.minimumLevel && char.classId === playerClass.id
    }
    $: userHasAppearance = function(item: ItemDataItem, modifier: AppearanceModifier): boolean {
        if ($settingsStore.transmog.completionistMode) {
            return $userTransmogStore.hasSource.has(`${item.id}_${modifier}`)
        }
        else {
            return $userTransmogStore.hasAppearance.has(item.appearances[modifier]?.appearanceId ?? -1)
        }
    }
</script>

<style lang="scss">
    .item-slot {
        @include cell-width(6rem, $paddingLeft: 0px, $paddingRight: 0px);

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

<CharacterTable
    skipGrouping={true}
    {filterFunc}
>
    <CharacterTableHead slot="head">
        <svelte:fragment slot="headText">
            {AppearanceModifier[modifier]}
        </svelte:fragment>

        {#each convertibleTypes as inventoryType}
            <th class="item-slot">
                {InventoryType[inventoryType]}
            </th>
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#each convertibleTypes as inventoryType}
            {@const item = data[inventoryType]}
            {@const userHas = userHasAppearance(item, modifier)}
            <td class="item-slot">
                {#if userHas}
                    <IconifyIcon
                        extraClass={'status-success'}
                        icon={uiIcons.yes}
                    />
                {:else}
                    <CharacterItems
                        {character}
                        {modifier}
                        {season}
                        setItem={item}
                    />
                {/if}
            </td>
        {/each}
    </svelte:fragment>
</CharacterTable>
