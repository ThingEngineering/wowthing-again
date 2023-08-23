<script lang="ts">
    import { itemStore, userStore } from '@/stores'
    import { ItemLocation, Region } from '@/enums'
    import { getItemUrlSearch } from '@/utils/get-item-url'
    import { toNiceNumber } from '@/utils/formatting'
    import type { Character } from '@/types'
    import type { StaticDataRealm } from '@/types/data/static'
    import type {
        ItemSearchResponseCharacter,
        ItemSearchResponseCommon,
        ItemSearchResponseGuildBank
    } from '@/types/items'
    import type { Guild } from '@/types/guild'

    export let characterItem: ItemSearchResponseCharacter = null
    export let guildBankItem: ItemSearchResponseGuildBank = null
    export let itemId: number

    let character: Character
    let guild: Guild
    let item: ItemSearchResponseCommon
    let realm: StaticDataRealm
    $: {
        if (characterItem) {
            character = $userStore.characterMap[characterItem.characterId]
            guild = undefined
            item = characterItem
            realm = character.realm
        }
        else {
            character = undefined
            guild = $userStore.guildMap[guildBankItem.guildId]
            item = guildBankItem
            realm = guild.realm
        }
    }
</script>

<tr class:highlight={!!guildBankItem}>
    {#if character}
        {#if userStore.useAccountTags}
            <td class="tag">
                {$userStore.accounts[character.accountId].tag || ''}
            </td>
        {/if}
        <td class="name text-overflow">
            <a
                class="quality{item.quality || $itemStore.items[itemId].quality || 0}"
                href={getItemUrlSearch(itemId, item)}
            >
                {character.name}
            </a>
        </td>
    {:else}
        <td class="guild-name text-overflow" colspan="2">
            <a
                class="quality{item.quality || $itemStore.items[itemId].quality || 0}"
                href={getItemUrlSearch(itemId, item)}
            >
                {guild?.name || 'Unknown Guild'}
            </a>
        </td>
    {/if}

    <td class="realm text-overflow">
        {Region[realm.region]}-{realm.name}
    </td>
    <td class="location">
        {#if characterItem}
            {ItemLocation[characterItem.location]}
        {:else}
            Tab {guildBankItem.tab}
        {/if}
    </td>
    <td class="count">
        {toNiceNumber(characterItem?.count || guildBankItem.count)}
    </td>
    <td class="item-level">
        {characterItem?.itemLevel || guildBankItem?.itemLevel || $itemStore.items[itemId].itemLevel || 0}
    </td>
</tr>
