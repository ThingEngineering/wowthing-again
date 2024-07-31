<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { InventoryType } from '@/enums/inventory-type';
    import { iconLibrary, uiIcons } from '@/shared/icons'
    import { userStore } from '@/stores';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { StaticDataCharacterClass } from '@/shared/stores/static/types';
    import type { LazyConvertibleModifier } from '@/stores/lazy/convertible';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'

    export let characterClass: StaticDataCharacterClass
    export let inventoryType: InventoryType
    export let modifier: LazyConvertibleModifier

    $: characters = sortBy(getNumberKeyedEntries(modifier.characters),
        ([id,]) => $userStore.characterMap[id].realm.name + '|' + $userStore.characterMap[id].name)
    $: console.log(characters)
</script>

<style lang="scss">
    h4 {
        --image-border-width: 1px;
    }
    .tag {
        border-right: 1px solid $border-color;
    }
    .name, .realm {
        @include cell-width(7rem);

        text-align: left;
    }
    .icon {
        padding-left: 0.1rem;
        padding-right: 0.1rem;
        width: 1.2rem;

        &:last-child {
            padding-right: 0.3rem;
        }
    }
    .faded {
        color: #888;
    }
</style>

<div class="wowthing-tooltip">
    <h4>
        <ClassIcon {characterClass} size={16} />
        {getGenderedName(characterClass.name, 0)}
    </h4>
    <h5>
        {InventoryType[inventoryType]}
    </h5>
    <table class="table-striped">
        <tbody>
            {#if modifier.userHas}
                <tr>
                    <td>Collected!</td>
                </tr>
            {:else}
                {#each characters as [characterId, characterData]}
                    {@const character = $userStore.characterMap[characterId]}
                    {@const canConvert = characterData.some((item) => item.canConvert)}
                    {@const canUpgrade = characterData.some((item) => item.canUpgrade)}
                    {@const isConvertible = characterData.some((item) => item.isConvertible)}
                    {@const isUpgradeable = characterData.some((item) => item.isUpgradeable)}
                    <tr>
                        {#if userStore.useAccountTags}
                            <td class="tag">{$userStore.accounts[character.accountId].tag || ''}</td>
                        {/if}
                        <td class="name">{character.name}</td>
                        <td class="realm">{character.realm.name}</td>
                        <td class="icon">
                            {#if isUpgradeable}
                                <IconifyIcon
                                    extraClass={canUpgrade ? 'status-shrug' : 'status-fail'}
                                    icon={uiIcons.plus}
                                />
                            {:else}
                                <span class="faded">--</span>
                            {/if}
                        </td>
                        <td class="icon">
                            {#if isConvertible}
                                <IconifyIcon
                                    extraClass={canConvert ? 'status-shrug' : 'status-fail'}
                                    icon={iconLibrary.gameShurikenAperture}
                                    scale={'0.85'}
                                />
                            {:else}
                                <span class="faded">--</span>
                            {/if}
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td>No characters can convert/upgrade this slot!</td>
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</div>
