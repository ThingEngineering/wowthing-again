<script lang="ts">
    import { DateTime } from 'luxon';
    // import { replace } from 'svelte-spa-router';

    import { timeLeft } from '@/data/auctions';
    import { itemModifierMap } from '@/data/item-modifier';
    import { euLocales } from '@/data/region';
    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { Faction } from '@/enums/faction';
    import { ItemBonusType } from '@/enums/item-bonus-type';
    import { Region } from '@/enums/region';
    import { iconLibrary } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { timeStore } from '@/shared/stores/time';
    import { basicTooltip, componentTooltip } from '@/shared/utils/tooltips';
    import { userStore } from '@/stores';
    import { auctionState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';
    import {
        userAuctionMissingRecipeStore,
        userAuctionMissingTransmogStore,
        type UserAuctionEntry,
    } from '@/stores/user-auctions';
    import connectedRealmName from '@/utils/connected-realm-name';
    import type { ItemDataItem } from '@/types/data/item';

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Paginate from '@/shared/components/paginate/Paginate.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';
    import RealmTooltip from './RealmTooltip.svelte';
    import TooltipAlreadyHave from '@/components/tooltips/auction-already-have/TooltipAuctionAlreadyHave.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { page, slug1 }: { page: number; slug1: string } = $props();

    function setRealmSearch(connectedRealmId: number) {
        const realmName =
            wowthingData.static.connectedRealmById.get(connectedRealmId).realmNames[0];
        if (slug1 === 'missing-recipes') {
            $auctionState.missingRecipeRealmSearch = realmName;
        } else {
            $auctionState.missingTransmogRealmSearch = realmName;
        }
    }

    // $: {
    //     if (
    //         slug1.startsWith('missing-appearance-') &&
    //         $auctionState.missingTransmogRealmSearch !== transmogRealmSearch
    //     ) {
    //         transmogRealmSearch = $auctionState.missingTransmogRealmSearch;
    //         if (page !== 1) {
    //             replace(`/auctions/${slug1}/1`);
    //         }
    //     } else if (
    //         slug1 === 'missing-recipes' &&
    //         $auctionState.missingRecipeRealmSearch !== recipeRealmSearch
    //     ) {
    //         recipeRealmSearch = $auctionState.missingRecipeRealmSearch;
    //         if (page !== 1) {
    //             replace(`/auctions/${slug1}/1`);
    //         }
    //     }
    // }

    let pageItems: UserAuctionEntry[] = $state();
    function exportShoppingList() {
        const lines: string[] = [];
        lines.push(`WoWthing ${DateTime.now().toUnixInteger()}`);
        for (const pageItem of pageItems) {
            lines.push(`"${pageItem.name}"`);
        }
        navigator.clipboard.writeText(lines.join('^'));
    }

    function getModifier(item: ItemDataItem, bonusIds: number[]): AppearanceModifier {
        let modifier = AppearanceModifier.Normal;

        if (item?.difficultyLookingForRaid) {
            modifier = AppearanceModifier.LookingForRaid;
        } else if (item?.difficultyHeroic) {
            modifier = AppearanceModifier.Heroic;
        } else if (item?.difficultyMythic) {
            modifier = AppearanceModifier.Mythic;
        }

        for (const bonusId of bonusIds || []) {
            const itemBonus = wowthingData.items.itemBonuses[bonusId];
            for (const bonus of itemBonus?.bonuses || []) {
                if (bonus[0] === ItemBonusType.AddItemNameDescription) {
                    if (bonus[1] === 1641 || bonus[1] === 13932 || bonus[1] === 14101) {
                        modifier = AppearanceModifier.LookingForRaid;
                    } else if (bonus[1] === 2015) {
                        modifier = AppearanceModifier.Heroic;
                    } else if (bonus[1] === 13145) {
                        modifier = AppearanceModifier.Mythic;
                    } else if (bonus[1] === 14000) {
                        modifier = AppearanceModifier.WodCraftedT2;
                    } else if (bonus[1] === 14001) {
                        modifier = AppearanceModifier.WodCraftedT3;
                    }
                }
            }
        }

        if (modifier === 0 && item?.limitCategory === 341) {
            modifier = AppearanceModifier.WodCraftedT1;
        }

        return modifier;
    }

    function getHaveClass(result: UserAuctionEntry, item: ItemDataItem): [boolean, boolean] {
        let [needAppearance, needSource] = [false, false];

        if (slug1.startsWith('missing-appearance-')) {
            // source
            if (result.id.includes('_')) {
                const [itemId, modifier] = result.id.split('_', 2).map((s) => parseInt(s));
                const appearance = item.appearances?.[modifier];
                needAppearance =
                    !!appearance &&
                    !userState.general.hasAppearanceById.has(appearance.appearanceId);
                needSource = !userState.general.hasAppearanceBySource.has(itemId * 1000 + modifier);
            } else {
                const appearanceId = parseInt(result.id);
                needAppearance = !userState.general.hasAppearanceById.has(appearanceId);
                for (const appearance of Object.values(item.appearances)) {
                    if (appearance.appearanceId === appearanceId) {
                        needSource = !userState.general.hasAppearanceBySource.has(
                            item.id * 1000 + appearance.modifier
                        );
                        break;
                    }
                }
            }
        }

        return [needAppearance, needSource];
    }
</script>

<style lang="scss">
    button {
        padding: 0;
    }
    .wrapper {
        align-items: flex-start;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0.75rem;
    }
    table {
        --padding: 2;

        border-collapse: collapse;
        display: inline-block;
        margin-bottom: 0.5rem;
        width: 23.5rem;

        &.faded {
            opacity: 0.6;
        }
    }
    th {
        background-color: var(--color-highlight-background);
        font-weight: normal;
        width: 23.5rem !important;
    }
    .filter-highlight {
        td {
            background: rgba(0, 255, 255, 0.13);
        }
    }
    .item {
        --image-border-width: 1px;
        // --image-margin-top: -4px;

        max-width: 22rem;
        padding-bottom: 0.2rem;
        padding-top: 0.2rem;
        text-align: left;

        :global(a) {
            min-width: 0;
        }

        :global(a > .flex-wrapper) {
            justify-content: start;
            gap: 0.4rem;
        }

        :global(.text-overflow) {
            text-align: left;
        }
    }
    .icons {
        --image-margin-top: -5px;

        margin-left: auto;

        :global(svg) {
            margin-left: -0.4rem;
        }
    }
    .already-have {
        color: var(--color-fail);
    }
    .clipboard {
        cursor: pointer;
        margin-right: -2px;
    }
    .realm {
        --width: 13rem;

        cursor: pointer;
        max-width: var(--width);
    }
    .price {
        --padding-left: 0;
        --width: 5.6rem;

        max-width: var(--width);
        text-align: right;
        white-space: nowrap;
        word-spacing: -0.2ch;
    }
    .time-left {
        --padding-left: 0;
        --width: 4.8rem;

        text-align: right;
        word-spacing: -0.2ch;
    }
    .total-gold {
        margin-left: auto;
        padding-right: 0.5rem;
    }
    code {
        color: var(--color-body-text);
    }
    .item-name-wrapper {
        :global(img + img) {
            margin-left: -0.2rem;
        }
    }
    .profession-character {
        --image-border-width: 1px;
        --image-margin-top: -2px;

        padding-bottom: 0;
    }
    .border-shrug {
        --image-margin-top: -5px;
    }
</style>

<UnderConstruction />

{#await slug1 === 'missing-recipes' ? userAuctionMissingRecipeStore.search(settingsState.value, $auctionState) : userAuctionMissingTransmogStore.search(settingsState.value, $auctionState, $userStore, slug1.replace('missing-appearance-', ''))}
    <div class="wrapper">L O A D I N G . . .</div>
{:then [things, updated]}
    {#if things.length > 0}
        {@const realmSearch = (
            slug1 === 'missing-recipes'
                ? $auctionState.missingRecipeRealmSearch
                : $auctionState.missingTransmogRealmSearch
        ).toLocaleLowerCase()}
        <Paginate
            items={things || []}
            perPage={$auctionState.limitToCheapestRealm ? 48 : 24}
            {page}
            bind:pageItems
            let:paginated
        >
            <div class="wrapper">
                {#each paginated as result (result.id)}
                    {@const auctions = result.auctions.slice(
                        0,
                        $auctionState.limitToCheapestRealm ? 1 : 5
                    )}
                    {@const itemId = auctions[0].itemId}
                    {@const item = wowthingData.items.items[itemId]}
                    {@const modifier = getModifier(item, auctions[0].bonusIds || [])}
                    {@const [needAppearance, needSource] = getHaveClass(result, item)}
                    <table class="table table-striped" class:faded={result.hasItems.length > 0}>
                        <thead>
                            {#if slug1 === 'missing-recipes' && $auctionState.missingRecipeProfessionId === -2}
                                {@const skillLineId =
                                    wowthingData.static.itemToSkillLine[auctions[0].itemId]?.[0] ||
                                    0}
                                {@const profession =
                                    wowthingData.static.professionBySkillLineId.get(
                                        skillLineId
                                    )?.[0]}
                                {@const characterIds =
                                    settingsState.value.professions.collectingCharactersV2?.[
                                        profession?.id || 0
                                    ]}
                                {#if characterIds?.length > 0}
                                    <tr>
                                        <th class="profession-character" colspan="3">
                                            <ProfessionIcon id={profession.id} />
                                            {#each characterIds as characterId (characterId)}
                                                {@const character =
                                                    userState.general.characterById[characterId]}
                                                <span class="class-{character.classId}">
                                                    {character.name}
                                                </span>
                                            {/each}
                                        </th>
                                    </tr>
                                {/if}
                            {/if}
                            <tr>
                                <th class="item text-overflow" colspan="3">
                                    <div class="flex-wrapper">
                                        <WowheadLink
                                            type="item"
                                            id={itemId}
                                            extraParams={{
                                                bonus: (auctions[0].bonusIds || []).join(':'),
                                            }}
                                        >
                                            <div class="flex-wrapper item-name-wrapper">
                                                {#if item.allianceOnly}
                                                    <FactionIcon faction={Faction.Alliance} />
                                                {:else if item.hordeOnly}
                                                    <FactionIcon faction={Faction.Horde} />
                                                {/if}

                                                {#if modifier > 0 && itemModifierMap[modifier]}
                                                    [{itemModifierMap[modifier][1]}]
                                                {/if}

                                                {#if slug1.startsWith('missing-appearance-')}
                                                    {@const abilityInfo =
                                                        wowthingData.static.professionAbilityByItemId.get(
                                                            auctions[0].itemId
                                                        )}
                                                    {#if abilityInfo}
                                                        <span class="border-shrug">
                                                            <ProfessionIcon
                                                                id={abilityInfo.professionId}
                                                                border={1}
                                                            />
                                                        </span>
                                                    {/if}
                                                {/if}

                                                <WowthingImage
                                                    name="item/{itemId}"
                                                    size={20}
                                                    border={1}
                                                />

                                                <ParsedText
                                                    cls="text-overflow"
                                                    text={'{' + `item:${itemId}` + '}'}
                                                />
                                            </div>
                                        </WowheadLink>

                                        <span class="icons">
                                            {#if needSource && !needAppearance}
                                                <IconifyIcon
                                                    extraClass="status-shrug"
                                                    icon={iconLibrary.mdiWizardHat}
                                                    scale="0.85"
                                                    tooltip="You have collected this appearance from another item"
                                                />
                                            {:else if needAppearance}
                                                <IconifyIcon
                                                    extraClass="status-fail"
                                                    icon={iconLibrary.mdiWizardHat}
                                                    scale="0.85"
                                                    tooltip="You have not collected this appearance"
                                                />
                                            {/if}

                                            {#if result.hasItems.length > 0}
                                                <span
                                                    class="already-have"
                                                    use:componentTooltip={{
                                                        component: TooltipAlreadyHave,
                                                        props: {
                                                            hasItems: result.hasItems,
                                                        },
                                                    }}
                                                >
                                                    <IconifyIcon
                                                        icon={iconLibrary.mdiAlertOutline}
                                                        scale="0.9"
                                                    />
                                                </span>
                                            {:else}
                                                <button
                                                    class="clipboard"
                                                    use:basicTooltip={'Copy to clipboard'}
                                                    onclick={() =>
                                                        navigator.clipboard.writeText(item.name)}
                                                >
                                                    <IconifyIcon
                                                        icon={iconLibrary.mdiClipboardPlusOutline}
                                                        scale="0.9"
                                                    />
                                                </button>
                                            {/if}
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each auctions as auction (auction)}
                                {@const connectedRealm = wowthingData.static.connectedRealmById.get(
                                    auction.connectedRealmId
                                )}
                                {@const ageInMinutes = Math.floor(
                                    $timeStore
                                        .diff(
                                            DateTime.fromSeconds(
                                                updated[auction.connectedRealmId] || 1000
                                            )
                                        )
                                        .toMillis() /
                                        1000 /
                                        60
                                )}
                                <tr
                                    class:filter-highlight={realmSearch &&
                                        !$auctionState.limitToCheapestRealm &&
                                        connectedRealm.realmNames.some(
                                            (name) =>
                                                name.toLocaleLowerCase().indexOf(realmSearch) >= 0
                                        )}
                                >
                                    <td
                                        class="realm text-overflow"
                                        onclick={() => setRealmSearch(auction.connectedRealmId)}
                                        use:componentTooltip={{
                                            component: RealmTooltip,
                                            props: {
                                                ageInMinutes,
                                                connectedRealm,
                                                price: auction.buyoutPrice,
                                            },
                                        }}
                                    >
                                        {#if connectedRealm.region === Region.EU && euLocales[connectedRealm.locale]}
                                            {@const { icon: countryIcon, name: countryName } =
                                                euLocales[connectedRealm.locale]}
                                            <IconifyIcon
                                                dropShadow={true}
                                                icon={countryIcon}
                                                tooltip={`EU: ${countryName}`}
                                            />
                                        {:else}
                                            <code>[{Region[connectedRealm.region]}]</code>
                                        {/if}

                                        <span
                                            class:auction-age-1={ageInMinutes < 20}
                                            class:auction-age-2={ageInMinutes >= 20 &&
                                                ageInMinutes < 40}
                                            class:auction-age-3={ageInMinutes >= 40 &&
                                                ageInMinutes < 60}
                                            class:auction-age-4={ageInMinutes >= 60}
                                        >
                                            {connectedRealmName(auction.connectedRealmId)}
                                        </span>
                                    </td>
                                    <td class="price">
                                        {#if auction.buyoutPrice < 10000}
                                            &lt;1 g
                                        {:else}
                                            {Math.floor(
                                                auction.buyoutPrice / 10000
                                            ).toLocaleString()} g
                                        {/if}
                                    </td>
                                    <td
                                        class="time-left"
                                        class:status-fail={auction.timeLeft === 0}
                                        class:status-shrug={auction.timeLeft === 1}
                                        class:status-success={auction.timeLeft > 1}
                                    >
                                        {timeLeft[auction.timeLeft]}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/each}
            </div>

            <div slot="bar-end" class="total-gold">
                <div class="bar-flex">
                    <span class="shopping-list">
                        <button
                            class="clipboard"
                            use:basicTooltip={'Copy shopping list to clipboard'}
                            onclick={() => exportShoppingList()}
                        >
                            <IconifyIcon icon={iconLibrary.mdiClipboardPlusOutline} scale="0.9" />
                        </button>
                    </span>
                    <span
                        class="total-gold"
                        use:basicTooltip={'Total gold required to buy the cheapest of each item'}
                    >
                        {Math.floor(
                            things.reduce((a, b) => a + b.auctions[0].buyoutPrice, 0) / 10000
                        ).toLocaleString()} g
                    </span>
                </div>
            </div>
        </Paginate>
    {:else}
        <div class="wrapper">
            <div>No results!</div>
        </div>
    {/if}
{/await}
