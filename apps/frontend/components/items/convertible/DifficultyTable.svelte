<script lang="ts">
    import some from 'lodash/some'

    import { classOrder } from '@/data/character-class'
    import { InventoryType } from '@/enums/inventory-type'
    import { iconLibrary, uiIcons } from '@/shared/icons'
    import { staticStore } from '@/shared/stores/static'
    import { getGenderedName } from '@/utils/get-gendered-name'
    import type { LazyConvertibleModifier } from '@/stores/lazy/convertible'

    import { convertibleTypes } from './data'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import { AppearanceModifier } from '@/enums/appearance-modifier';

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
                <tr>
                    <td class="name class-{classId}">
                        {getGenderedName(characterClass.name, 0)}
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
                                {@const canConvert = some(
                                    Object.values(data.characters),
                                    (entries) => some(entries, (entry) => entry.canConvert)
                                )}
                                {@const isConvertible = some(
                                    Object.values(data.characters),
                                    (entries) => some(entries, (entry) => entry.isConvertible)
                                )}
                                {@const canUpgrade = some(
                                    Object.values(data.characters),
                                    (entries) => some(entries, (entry) => entry.canUpgrade)
                                )}
                                {@const isUpgradeable = some(
                                    Object.values(data.characters),
                                    (entries) => some(entries, (entry) => entry.isUpgradeable)
                                )}
                                
                                {#if isUpgradeable || isConvertible}
                                    {#if isUpgradeable}
                                        <IconifyIcon
                                            extraClass={canUpgrade ? 'status-success' : 'status-fail'}
                                            icon={uiIcons.plus}
                                            tooltip={'Upgrade this item!'}
                                        />
                                    {/if}
                                    {#if isConvertible}
                                        <IconifyIcon
                                            extraClass={canConvert ? 'status-success' : 'status-fail'}
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
