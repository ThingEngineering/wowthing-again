<script lang="ts">
    import type { Snippet } from 'svelte';

    import { ItemBinding } from '@/enums/item-binding';
    import { ItemLocation } from '@/enums/item-location';
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { toNiceNumber } from '@/utils/formatting';
    import { getItemUrlSearch } from '@/utils/get-item-url';
    import type { StaticDataRealm } from '@/shared/stores/static/types';
    import type { Character } from '@/types';
    import type { Guild } from '@/types/guild';
    import type {
        ItemSearchResponseCharacter,
        ItemSearchResponseCommon,
        ItemSearchResponseGuildBank,
        ItemSearchResponseWarbank,
    } from '@/types/items';

    import CharacterTag from '@/user-home/components/character/CharacterTag.svelte';

    type Props = {
        bindType: Snippet<[ItemBinding, boolean]>;
        itemId: number;
        characterItem?: ItemSearchResponseCharacter;
        guildBankItem?: ItemSearchResponseGuildBank;
        warbankItem?: ItemSearchResponseWarbank;
    };
    let { bindType, itemId, characterItem, guildBankItem, warbankItem }: Props = $props();

    let { character, guild, item, realmName } = $derived.by(() => {
        const ret: Partial<{
            character: Character;
            guild: Guild;
            item: ItemSearchResponseCommon;
            realmName: string;
        }> = {};

        let realm: StaticDataRealm;
        let region: Region;

        if (characterItem) {
            ret.character = userState.general.characterById[characterItem.characterId];
            ret.item = characterItem;
            realm = ret.character.realm;
        } else if (guildBankItem) {
            ret.guild = userState.general.guildById[guildBankItem.guildId];
            ret.item = guildBankItem;
            realm = ret.guild.realm;
        } else if (warbankItem) {
            ret.item = warbankItem;
            region = warbankItem.region;
        }

        ret.realmName = realm ? `${Region[realm.region]}-${realm.name}` : Region[region];

        return ret;
    });
</script>

<tr class:highlight={!!guildBankItem}>
    {#if warbankItem}
        <td class="guild-name text-overflow" colspan={settingsState.useAccountTags ? 2 : 1}>
            {@render bindType(warbankItem.bindType, warbankItem.bound)}
            <a
                class="quality{item.quality || wowthingData.items.items[itemId].quality || 0}"
                href={getItemUrlSearch(itemId, item)}
            >
                Account Bank
            </a>
        </td>
    {:else if character}
        <CharacterTag {character} />
        <td class="name text-overflow">
            {@render bindType(characterItem.bindType, characterItem.bound)}
            <a class="class-{character.classId}" href={getItemUrlSearch(itemId, item)}>
                {character.name}
            </a>
        </td>
    {:else}
        <td class="guild-name text-overflow" colspan={settingsState.useAccountTags ? 2 : 1}>
            <a
                class="quality{item.quality || wowthingData.items.items[itemId].quality || 0}"
                href={getItemUrlSearch(itemId, item)}
            >
                {guild?.name || 'Unknown Guild'}
            </a>
        </td>
    {/if}

    <td class="realm text-overflow" data-tooltip={realmName}>
        {realmName}
    </td>
    <td class="location quality{item.quality || wowthingData.items.items[itemId].quality || 0}">
        {#if characterItem}
            {ItemLocation[characterItem.location]}
        {:else}
            Tab {guildBankItem?.tab || warbankItem?.tab}
        {/if}
    </td>
    <td class="count">
        {toNiceNumber(characterItem?.count || guildBankItem?.count || warbankItem?.count || 0)}
    </td>
    <td class="item-level">
        {characterItem?.itemLevel ||
            guildBankItem?.itemLevel ||
            wowthingData.items.items[itemId].itemLevel ||
            0}
    </td>
</tr>
