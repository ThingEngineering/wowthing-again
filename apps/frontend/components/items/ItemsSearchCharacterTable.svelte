<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { itemSearchState } from '@/stores';
    import { userState } from '@/user-home/state/user';
    import type { Character } from '@/types';
    import type { ItemSearchResponseCharacter, ItemSearchResponseItem } from '@/types/items';

    import CharacterTag from '@/shared/components/CharacterTag.svelte';
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import Row from './ItemsSearchCharacterRow.svelte';

    export let response: ItemSearchResponseItem[];

    type CharacterItem = ItemSearchResponseCharacter & { itemId: number };

    let characters: [Character, CharacterItem[]][];
    $: {
        const characterMap: Record<number, CharacterItem[]> = {};
        // let guildBanks = {}
        for (const item of response) {
            for (const character of item.characters || []) {
                characterMap[character.characterId] ||= [];
                characterMap[character.characterId].push({
                    itemId: item.itemId,
                    ...character,
                });
            }

            if ($itemSearchState.includeEquipped) {
                for (const character of item.equipped || []) {
                    characterMap[character.characterId] ||= [];
                    characterMap[character.characterId].push({
                        itemId: item.itemId,
                        ...character,
                    });
                }
            }

            // for (const guildBank of (item.guildBanks || [])) {
            //     characterMap[character.characterId] ||= [] 1`2
            //     characterMap[character.characterId].push(character)
            // }
        }

        characters = sortBy(
            Object.entries(characterMap).map(([characterId, data]) => [
                userState.general.characterById[parseInt(characterId)],
                data,
            ]),
            ([character]) =>
                [Region[character.realm.region], character.realm.name, character.name].join('|')
        );
    }
</script>

{#each characters as [character, items] (character.id)}
    <table class="table table-striped search-table">
        <thead>
            <tr class="item-row">
                {#if settingsState.useAccountTags}
                    <td class="tag">
                        <CharacterTag {character} />
                    </td>
                {/if}
                <th class="item">
                    <ClassIcon classId={character.classId} size={16} border={1} />
                    {character.name}
                </th>
                <th class="realm text-overflow" colspan="3">
                    {Region[character.realm.region]}-{character.realm.name}
                </th>
            </tr>
        </thead>

        <tbody>
            {#each items as characterItem (characterItem)}
                <Row itemId={characterItem.itemId} {characterItem} />
            {/each}
            <!-- 
            {#each (item.guildBanks || []) as guildBankItem}
                <Row
                    itemId={item.itemId}
                    {guildBankItem}
                />
            {/each} -->
        </tbody>
    </table>
{:else}
    <table class="table table-striped search-table">
        <tbody>
            <tr>
                <td>No items found.</td>
            </tr>
        </tbody>
    </table>
{/each}
