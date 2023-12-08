<script lang="ts">
    import { userStore } from '@/stores/user'

    import { Region } from '@/enums/region'
    import { uiIcons } from '@/shared/icons'

    import { commoditiesState } from './local-storage'
    import type { CharacterCommodities } from './get-character-commodities'
    import type { CommodityData } from './store'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let characterData: CharacterCommodities
    export let commodities: CommodityData

    $: character = $userStore.characterMap[characterData.characterId]

    let items: [number, number, number][]
    $: {
        items = Object.entries(characterData.itemCounts)
            .map(([itemIdString, itemCount]) => {
                const itemId = parseInt(itemIdString)
                return [
                    itemId,
                    itemCount,
                    itemCount * commodities.regions[character.realm.region][itemId] / 100,
                ]
            })
        items.sort((a, b) => b[2] - a[2])
    }

    $: isExpanded = $commoditiesState.expanded[characterData.characterId] === true
</script>

<style lang="scss">
    table {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        display: inline-block;
        margin-bottom: 0.5rem;
        min-width: 25rem;
        width: 25rem;
    }
    .character-realm {
        @include cell-width(19.5rem);

        .realm {
            float: right;
        }
    }
    .name {
        @include cell-width(16rem);
    }
    .count {
        @include cell-width(3rem);

        text-align: right;
    }
    .value {
        @include cell-width(5rem);

        text-align: right;
    }
</style>

<table class="table table-striped">
    <thead>
        <tr>
            <td class="character-realm" colspan="2">
                <IconifyIcon
                    icon={isExpanded ? uiIcons.minus : uiIcons.plus}
                    on:click={() => $commoditiesState.expanded[characterData.characterId] = !isExpanded}
                    tooltip={isExpanded ? 'Collapse this character' : 'Expand this character'}
                />
                <span class="class-{character.classId}">
                    {character.name}
                </span>
                <span class="realm">
                    {Region[character.realm.region]}-{character.realm.name}
                </span>
            </td>
            <td class="value">
                {Math.floor(characterData.totalValue).toLocaleString()} g
            </td>
        </tr>
    </thead>
    <tbody>
        {#if isExpanded}
            {#each items as itemData}
                <tr>
                    <td class="name text-overflow">
                        <WowheadLink
                            type="item"
                            id={itemData[0]}
                        >
                            <WowthingImage
                                name={`item/${itemData[0]}`}
                                size={16}
                                border={1}
                            />
                            <ParsedText text={`{item:${itemData[0]}}`} />
                        </WowheadLink>
                    </td>
                    <td class="count">
                        {itemData[1].toLocaleString()}
                    </td>
                    <td class="value">
                        {Math.floor(itemData[2]).toLocaleString()} g
                    </td>
                </tr>
            {/each}
        {/if}
    </tbody>
</table>
