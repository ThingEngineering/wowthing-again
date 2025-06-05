<script lang="ts">
    import { DateTime } from 'luxon';

    import { wowthingData } from '@/shared/stores/data';
    import { staticStore } from '@/shared/stores/static';
    import { timeStore } from '@/shared/stores/time';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { lazyStore } from '@/stores';
    import { toNiceDuration, toNiceNumber } from '@/utils/formatting';
    import type { Character, CharacterPatronOrder } from '@/types/character';

    import type { CommodityData } from './auction-store';

    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import type { LazyCharacterProfessions } from '@/stores/lazy/character';
    import type { StaticDataProfessionAbility } from '@/shared/stores/static/types';

    export let character: Character;
    export let commodities: CommodityData = undefined;
    export let patronOrder: CharacterPatronOrder = undefined;

    let ability: StaticDataProfessionAbility;
    let characterProfessions: LazyCharacterProfessions;
    let craftingPrice: number;
    let notLearned: boolean;
    let providedReagents: Record<number, number>;
    let timeRemaining: number;
    $: {
        craftingPrice = 0;

        if (patronOrder) {
            characterProfessions = $lazyStore.characters[character.id].professions;
            notLearned = !characterProfessions.knownRecipes.has(patronOrder.skillLineAbilityId);
            ability =
                $staticStore.professionAbilityByAbilityId[patronOrder.skillLineAbilityId].ability;
            providedReagents = Object.fromEntries(
                patronOrder.reagents.map((reagent) => [reagent.itemId, reagent.count])
            );
            timeRemaining = DateTime.fromSeconds(patronOrder.expirationTime, { zone: 'utc' })
                .diff($timeStore)
                .toMillis();

            for (const reagent of ability.categoryReagents) {
                const itemIds = $staticStore.reagentCategories[reagent.categoryIds[0]] || [];
                if (itemIds.some((itemId) => providedReagents[itemId] !== undefined)) {
                    continue;
                }

                const minPrice = Math.min(
                    ...itemIds.map(
                        (itemId) =>
                            commodities.regions?.[character.realm.region]?.[itemId] || 999999999
                    )
                );
                craftingPrice += reagent.count * minPrice;
            }

            for (const [count, itemId] of ability.itemReagents) {
                if (providedReagents[itemId] !== undefined) {
                    continue;
                }

                craftingPrice +=
                    count * (commodities.regions?.[character.realm.region]?.[itemId] || 999999999);
            }
        }
    }
</script>

<style lang="scss">
    .flex-wrapper {
        --image-margin-top: -4px;

        align-items: stretch;
        justify-content: start;

        &.faded {
            opacity: $inactive-opacity;
        }
        &:not(:last-child) {
            border-bottom: 1px solid $border-color;
        }
    }
    .remaining {
        padding: 0 0.3rem;
        text-align: right;
        width: 5rem;
    }
    .quality {
        text-align: center;
        width: 2.4rem;
    }
    .item {
        --image-margin-top: -4px;

        padding: 0 0.3rem;
        width: 20rem;
    }
    .gold {
        text-align: right;
        padding: 0 0.3rem;
        width: 4rem;
    }
    .cost {
        text-align: right;
        padding: 0 0.3rem;
        width: 4.4rem;
    }
    .rewards {
        --link-color: $text-color;

        display: flex;
        gap: 0.2rem;
        padding: 0 0.3rem 0 0;
    }
    .reward {
        --image-margin-top: -4px;

        text-align: right;
        width: 3.1rem;
    }
    .reagents {
        display: flex;
        gap: 0.2rem;
        padding: 0 0.3rem;
        min-width: 22.8rem;
    }
    .reagent {
        --image-margin-top: -4px;

        text-align: right;
        width: 3.5rem;
    }
</style>

{#if patronOrder}
    <div class="flex-wrapper" class:faded={notLearned}>
        <div class="remaining">
            <code class:status-warn={timeRemaining < 43200000}>
                {@html toNiceDuration(timeRemaining, true)}
            </code>
        </div>
        <div class="quality border-left">
            <CraftedQualityIcon quality={patronOrder.minQuality} />
        </div>
        <div
            class="item text-overflow quality{wowthingData.items.items[patronOrder.itemId].quality}"
        >
            <WowheadLink type="spell" id={ability.spellId}>
                <WowthingImage name="item/{patronOrder.itemId}" size={20} border={1} />
                {wowthingData.items.items[patronOrder.itemId].name}
            </WowheadLink>
        </div>
        <div
            class="gold border-left"
            class:status-warn={notLearned}
            use:basicTooltip={'Gold reward'}
        >
            {(patronOrder.tipAmount / 10000).toFixed(1)} g
        </div>
        <div class="rewards border-left">
            {#each patronOrder.rewards as reward}
                <div class="reward">
                    <WowheadLink type="item" id={reward.itemId}>
                        {reward.count}
                        <WowthingImage
                            name="item/{reward.itemId}"
                            size={20}
                            border={1}
                            cls={`quality${wowthingData.items.items[reward.itemId].quality}-border`}
                        />
                    </WowheadLink>
                </div>
            {/each}
            {#if patronOrder.rewards.length === 1}
                <div class="reward"></div>
            {/if}
        </div>
        <div
            class="cost border-left"
            class:status-success={craftingPrice * 100 <= patronOrder.tipAmount}
            class:status-warn={craftingPrice * 100 > patronOrder.tipAmount}
            use:basicTooltip={'APPROXIMATE cost to craft'}
        >
            -{toNiceNumber(Math.floor(craftingPrice / 100))} g
        </div>
        <div class="reagents border-left">
            {#each ability.itemReagents as [count, itemId]}
                {@const provided = providedReagents[itemId] || 0}
                <div
                    class="reagent"
                    class:status-success={provided >= count}
                    class:border-success={provided >= count}
                    class:status-warn={provided < count}
                    class:border-warn={provided < count}
                >
                    <WowheadLink type="item" id={itemId}>
                        {count}
                        <WowthingImage name="item/{itemId}" size={20} border={1} />
                    </WowheadLink>
                </div>
            {/each}

            {#each ability.categoryReagents as abilityReagent}
                {@const category = $staticStore.reagentCategories[abilityReagent.categoryIds[0]]}
                {#if category}
                    {@const provided = category.reduce((a, b) => a + (providedReagents[b] || 0), 0)}
                    <div
                        class="reagent"
                        class:status-success={provided >= abilityReagent.count}
                        class:border-success={provided >= abilityReagent.count}
                        class:status-warn={provided < abilityReagent.count}
                        class:border-warn={provided < abilityReagent.count}
                    >
                        <WowheadLink type="item" id={category[0]}>
                            {abilityReagent.count}
                            <WowthingImage name="item/{category[0]}" size={20} border={1} />
                        </WowheadLink>
                    </div>
                {:else}
                    {JSON.stringify(abilityReagent)}
                {/if}
            {/each}
        </div>
    </div>
{:else}
    <div class="flex-wrapper">
        <div class="remaining">No active patron orders!</div>
        <div class="quality"></div>
        <div class="item"></div>
        <div class="gold"></div>
        <div class="rewards">
            <div class="reward"></div>
            <div class="reward"></div>
        </div>
        <div class="cost"></div>
        <div class="reagents"></div>
    </div>
{/if}
