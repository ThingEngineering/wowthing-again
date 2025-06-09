<script lang="ts">
    import { Region } from '@/enums/region';
    import { uiIcons } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';

    import { commoditiesState } from './local-storage';
    import type { CharacterCommodities } from './get-character-commodities';
    import type { CommodityData } from './store';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let characterData: CharacterCommodities;
    export let commodities: CommodityData;

    $: character = userState.general.characterById[characterData.characterId];

    let items: [number, number, number][];
    $: {
        items = Object.entries(characterData.itemCounts).map(([itemIdString, itemCount]) => {
            const itemId = parseInt(itemIdString);
            return [
                itemId,
                itemCount,
                (itemCount * commodities.regions[character.realm.region][itemId]) / 100,
            ];
        });
        items.sort((a, b) => b[2] - a[2]);
    }

    $: isExpanded = $commoditiesState.expanded[characterData.characterId] === true;
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
    .tag {
        background: $highlight-background;
        border-left: 1px solid $border-color;
        border-right: 1px solid $border-color;
        margin-right: $width-padding;
        padding-left: $width-padding;
        padding-right: $width-padding;
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
                    on:click={() =>
                        ($commoditiesState.expanded[characterData.characterId] = !isExpanded)}
                    tooltip={isExpanded ? 'Collapse this character' : 'Expand this character'}
                />
                {#if settingsState.useAccountTags}
                    <span class="tag">
                        {settingsState.value.accounts?.[character.accountId]?.tag}
                    </span>
                {/if}
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
            {#each items as [itemId, itemCount, itemValue] (itemId)}
                <tr>
                    <td class="name text-overflow">
                        <WowheadLink type="item" id={itemId}>
                            <WowthingImage name={`item/${itemId}`} size={16} border={1} />
                            <ParsedText text={`{item:${itemId}}`} />
                        </WowheadLink>
                    </td>
                    <td class="count">
                        {itemCount.toLocaleString()}
                    </td>
                    <td class="value">
                        {Math.floor(itemValue).toLocaleString()} g
                    </td>
                </tr>
            {/each}
        {/if}
    </tbody>
</table>
