<script lang="ts">
    import { itemStore, userStore } from '@/stores'
    import { ItemLocation, Region } from '@/types/enums'
    import { getItemUrlSearch } from '@/utils/get-item-url'
    import { toNiceNumber } from '@/utils/to-nice'
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
            character = $userStore.data.characterMap[characterItem.characterId]
            guild = undefined
            item = characterItem
            realm = character.realm
        }
        else {
            character = undefined
            guild = $userStore.data.guilds[guildBankItem.guildId]
            item = guildBankItem
            realm = guild.realm
        }
    }
</script>

<style lang="scss">
    .tag {
        @include cell-width(0.5rem);

        background: $highlight-background;
        border-right: 1px solid $border-color;
        text-align: center;
    }
    .name, .guild-name {
        a {
            text-decoration: underline;
        }
    }
    .name {
        @include cell-width(8rem);
    }
    .guild-name {
        @include cell-width(9.5rem);
    }
    .realm {
        @include cell-width(5rem);

        white-space: nowrap;
    }
    .location {
        @include cell-width($width-item-location);

        white-space: nowrap;
    }
    .count {
        @include cell-width($width-item-count);

        text-align: right;
    }
    .item-level {
        @include cell-width($width-item-level);

        text-align: right;
    }
</style>

<tr class:highlight={!!guildBankItem}>
    {#if character}
        {#if userStore.useAccountTags}
            <td class="tag">
                {$userStore.data.accounts[character.accountId].tag || ''}
            </td>
        {/if}
        <td class="name text-overflow">
            <a
                class="quality{item.quality || $itemStore.data.items[itemId].quality || 0}"
                href={getItemUrlSearch(itemId, item)}
            >
                {character.name}
            </a>
        </td>
    {:else}
        <td class="guild-name text-overflow" colspan="2">
            <a
                class="quality{item.quality || 0}"
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
        {characterItem?.itemLevel || guildBankItem?.itemLevel || $itemStore.data.items[itemId].itemLevel || 0}
    </td>
</tr>
