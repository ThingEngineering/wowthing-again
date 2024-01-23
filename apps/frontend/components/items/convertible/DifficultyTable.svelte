<script lang="ts">
    import { classOrder } from '@/data/character-class'
    import { AppearanceModifier } from '@/enums/appearance-modifier'
    import { InventoryType } from '@/enums/inventory-type'
    import { iconLibrary, uiIcons } from '@/shared/icons'
    import { staticStore } from '@/shared/stores/static'
    import { getGenderedName } from '@/utils/get-gendered-name'
    import getPercentClass from '@/utils/get-percent-class'
    import type { LazyConvertibleModifier } from '@/stores/lazy/convertible'

    import { convertibleTypes } from './data'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'

    export let classData: Record<number, Record<number, LazyConvertibleModifier>>
    export let modifier: number
</script>

<style lang="scss">
    th {
        font-weight: 600;
    }
    th.name {
        text-align: left;
    }
    .name {
        @include cell-width(9rem);
    }
    .counts {
        @include cell-width(3rem);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    .item-slot {
        --image-margin-top: -4px;

        @include cell-width(6rem, $paddingLeft: 0px, $paddingRight: 0px);

        border-left: 1px solid $border-color;
        padding-bottom: 0.2rem;
        padding-top: 0.2rem;
        text-align: center;
    }
</style>

<div class="wrapper">
    <table class="table table-striped">
        <thead>
            <tr>
                <th class="name">
                    {AppearanceModifier[modifier]}
                </th>
                <th class="counts">Now</th>
                <th class="counts">Max</th>
                {#each convertibleTypes as inventoryType}
                    <th class="item-slot">
                        {InventoryType[inventoryType]}
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each classOrder as classId}
                {@const characterClass = $staticStore.characterClasses[classId]}
                {@const slotsHave = Object.values(classData[classId]).filter((mod) => mod.userHas).length}
                {@const slotsCouldHave = Object.values(classData[classId]).filter((mod) => mod.userHas || mod.anyIsConvertible || mod.anyIsUpgradeable).length}
                {@const slotsTotal = Object.values(classData[classId]).length}
                <tr>
                    <td class="name class-{classId}">
                        {getGenderedName(characterClass.name, 0)}
                    </td>
                    <td class="counts {getPercentClass(slotsHave / slotsTotal * 100)}">
                        {slotsHave}
                        /
                        {slotsTotal}
                    </td>
                    <td class="counts {getPercentClass(slotsCouldHave / slotsTotal * 100)}">
                        {slotsCouldHave}
                        /
                        {slotsTotal}
                    </td>
                    
                    {#each convertibleTypes as inventoryType}
                        {@const data = classData[classId][inventoryType]}
                        <td class="item-slot">
                            {#if data.userHas}
                                <IconifyIcon
                                    extraClass={'status-success'}
                                    icon={uiIcons.yes}
                                />
                            {:else}
                                {#if data.anyIsUpgradeable || data.anyIsConvertible}
                                    {#if data.anyIsUpgradeable}
                                        <IconifyIcon
                                            extraClass={data.anyCanUpgrade ? 'status-success' : 'status-fail'}
                                            icon={uiIcons.plus}
                                            tooltip={'Upgrade this item!'}
                                        />
                                    {/if}
                                    {#if data.anyIsConvertible}
                                        <IconifyIcon
                                            extraClass={data.anyCanConvert ? 'status-success' : 'status-fail'}
                                            icon={iconLibrary.gameShurikenAperture}
                                            scale={'0.85'}
                                            tooltip={'Convert this item at the Catalyst!'}
                                        />
                                    {/if}
                                {:else}
                                    <span class="status-fail">---</span>
                                {/if}
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
