<script lang="ts">
    import { staticStore, userStore } from '@/stores'
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
            item = characterItem
            realm = character.realm
        }
        else {
            guild = $userStore.data.guilds[guildBankItem.guildId]
            item = guildBankItem
            realm = guild.realm
        }
    }
</script>

<style lang="scss">
    .name {
        @include cell-width(6rem);

        a {
            text-decoration: underline;
        }
    }
    .realm {
        @include cell-width(5rem);

        white-space: nowrap;
    }
    .location {
        @include cell-width($width-item-location);
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
    <td class="name text-overflow">
        <a
            class="quality{characterItem?.quality || guildBankItem?.quality || 0}"
            href={getItemUrlSearch(itemId, item)}
        >
            {character?.name || guild?.name || 'Unknown Guild'}
        </a>
    </td>
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
        {characterItem?.itemLevel || guildBankItem?.itemLevel || 0}
    </td>
</tr>
