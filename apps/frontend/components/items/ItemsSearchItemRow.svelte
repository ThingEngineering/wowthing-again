<script lang="ts">
    import { ItemLocation } from '@/enums/item-location'
    import { Region } from '@/enums/region'
    import { itemStore, userStore } from '@/stores'
    import { getItemUrlSearch } from '@/utils/get-item-url'
    import { toNiceNumber } from '@/utils/formatting'
    import type { Character } from '@/types'
    import type { StaticDataRealm } from '@/shared/stores/static/types'
    import type {
        ItemSearchResponseCharacter,
        ItemSearchResponseCommon,
        ItemSearchResponseGuildBank,

        ItemSearchResponseWarbank

    } from '@/types/items'
    import type { Guild } from '@/types/guild'

    export let characterItem: ItemSearchResponseCharacter = null
    export let guildBankItem: ItemSearchResponseGuildBank = null
    export let warbankItem: ItemSearchResponseWarbank = null
    export let itemId: number

    let character: Character
    let guild: Guild
    let item: ItemSearchResponseCommon
    let realm: StaticDataRealm
    let region: Region
    $: {
        character = undefined
        guild = undefined
        realm = undefined

        if (characterItem) {
            character = $userStore.characterMap[characterItem.characterId]
            item = characterItem
            realm = character.realm
        } else if (guildBankItem) {
            guild = $userStore.guildMap[guildBankItem.guildId]
            item = guildBankItem
            realm = guild.realm
        } else if (warbankItem) {
            item = warbankItem
            region = warbankItem.region
        }
    }
</script>

<tr class:highlight={!!guildBankItem}>
    {#if warbankItem}
        <td class="guild-name text-overflow" colspan="{userStore.useAccountTags ? 2 : 1}">
            <a
                class="quality{item.quality || $itemStore.items[itemId].quality || 0}"
                href={getItemUrlSearch(itemId, item)}
            >
                Account Bank
            </a>
        </td>
    {:else if character}
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
        <td class="guild-name text-overflow" colspan="{userStore.useAccountTags ? 2 : 1}">
            <a
                class="quality{item.quality || $itemStore.items[itemId].quality || 0}"
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
    <td class="location">
        {#if characterItem}
            {ItemLocation[characterItem.location]}
        {:else}
            Tab {guildBankItem?.tab || warbankItem?.tab}
        {/if}
    </td>
    <td class="count">
        {toNiceNumber(characterItem?.count || guildBankItem?.count || warbankItem?.count)}
    </td>
    <td class="item-level">
        {characterItem?.itemLevel || guildBankItem?.itemLevel || $itemStore.items[itemId].itemLevel || 0}
    </td>
</tr>
