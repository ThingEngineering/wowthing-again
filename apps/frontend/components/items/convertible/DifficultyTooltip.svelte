<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { InventoryType } from '@/enums/inventory-type';
    import { iconLibrary, uiIcons } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { StaticDataCharacterClass } from '@/shared/stores/static/types';
    import type { LazyConvertibleModifier } from '@/user-home/state/lazy/convertible.svelte';

    import CharacterTag from '@/shared/components/CharacterTag.svelte';
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    type Props = {
        characterClass: StaticDataCharacterClass;
        inventoryType: InventoryType;
        modifier: LazyConvertibleModifier;
    };

    let { characterClass, inventoryType, modifier }: Props = $props();

    let characters = $derived.by(() =>
        sortBy(getNumberKeyedEntries(modifier.characters), ([id]) => {
            const character = userState.general.characterById[id];
            return `${character.realm.name}|${character.name}`;
        })
    );
</script>

<style lang="scss">
    h4 {
        --image-border-width: 1px;
    }
    .tag {
        border-right: 1px solid $border-color;
    }
    .name,
    .realm {
        @include cell-width(7rem);

        text-align: left;
    }
    .icon {
        padding-left: 0.1rem;
        padding-right: 0.1rem;
        text-align: center;
        width: 1.7rem;

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
                {#each characters as [characterId, characterData] (characterId)}
                    {@const character = userState.general.characterById[characterId]}
                    {@const canConvert = characterData.some((item) => item.canConvert)}
                    {@const canUpgrade = characterData.some((item) => item.canUpgrade)}
                    {@const isConvertible = characterData.some((item) => item.isConvertible)}
                    {@const isPurchased = characterData.some((item) => item.isPurchased)}
                    {@const isUpgradeable = characterData.some((item) => item.isUpgradeable)}
                    <tr>
                        {#if settingsState.useAccountTags}
                            <td class="tag">
                                <CharacterTag {character} />
                            </td>
                        {/if}
                        <td class="name">{character.name}</td>
                        <td class="realm">{character.realm.name}</td>
                        <td class="icon">
                            {#if isPurchased}
                                <IconifyIcon
                                    extraClass={canUpgrade ? 'status-shrug' : 'status-fail'}
                                    icon={iconLibrary.mdiCurrencyUsd}
                                    scale="0.85"
                                />
                            {:else}
                                <span class="faded">--</span>
                            {/if}
                        </td>
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
                                    scale="0.85"
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
