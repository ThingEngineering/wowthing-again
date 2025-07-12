<script lang="ts">
    import { ItemLocation } from '@/enums/item-location';
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { toNiceNumber } from '@/utils/formatting';
    import { getItemUrlSearch } from '@/utils/get-item-url';
    import type { StaticDataRealm } from '@/shared/stores/static/types';
    import type { Character } from '@/types';
    import type {
        ItemSearchResponseCharacter,
        ItemSearchResponseCommon,
        ItemSearchResponseGuildBank,
        ItemSearchResponseWarbank,
    } from '@/types/items';
    import type { Guild } from '@/types/guild';

    import CharacterTag from '@/shared/components/CharacterTag.svelte';

    export let characterItem: ItemSearchResponseCharacter = null;
    export let guildBankItem: ItemSearchResponseGuildBank = null;
    export let warbankItem: ItemSearchResponseWarbank = null;
    export let itemId: number;

    let character: Character;
    let guild: Guild;
    let item: ItemSearchResponseCommon;
    let realm: StaticDataRealm;
    let region: Region;
    $: {
        character = undefined;
        guild = undefined;
        realm = undefined;

        if (characterItem) {
            character = userState.general.characterById[characterItem.characterId];
            item = characterItem;
            realm = character.realm;
        } else if (guildBankItem) {
            guild = userState.general.guildById[guildBankItem.guildId];
            item = guildBankItem;
            realm = guild.realm;
        } else if (warbankItem) {
            item = warbankItem;
            region = warbankItem.region;
        }
    }
</script>

<tr class:highlight={!!guildBankItem}>
    {#if warbankItem}
        <td class="guild-name text-overflow" colspan={settingsState.useAccountTags ? 2 : 1}>
            <a
                class="quality{item.quality || wowthingData.items.items[itemId].quality || 0}"
                href={getItemUrlSearch(itemId, item)}
            >
                Account Bank
            </a>
        </td>
    {:else if character}
        {#if settingsState.useAccountTags}
            <td class="tag">
                <CharacterTag {character} />
            </td>
        {/if}
        <td class="name text-overflow">
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

    <td class="realm text-overflow">
        {#if realm}
            {Region[realm.region]}-{realm.name}
        {:else}
            {Region[region]}
        {/if}
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
