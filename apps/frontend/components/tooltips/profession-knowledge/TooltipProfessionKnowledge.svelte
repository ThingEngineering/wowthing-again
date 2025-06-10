<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import type { Profession } from '@/enums/profession';
    import type { Character } from '@/types';
    import type { TaskProfessionQuest } from '@/types/data';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    export let character: Character;
    export let reputationId: number;
    export let zoneData: {
        have: number;
        total: number;
        items: {
            have: boolean;
            profession: Profession;
            itemId?: number;
            quest?: TaskProfessionQuest;
            source?: string;
        }[];
    };
    export let zoneName: string;

    $: characterRenown = reputationId
        ? Math.floor((character.reputations?.[reputationId] ?? 0) / 2500)
        : 0;

    let totalCosts: Set<number>;
    $: {
        totalCosts = new Set();
        for (const item of zoneData.items) {
            for (const cost of item.quest?.costs || []) {
                totalCosts.add(cost.currencyId || cost.itemId + 1000000);
            }
        }
    }
</script>

<style lang="scss">
    .profession {
        --image-border-width: 1px;

        padding-left: 0;
        padding-right: 0;
        text-align: center;
        width: 1.4rem;
    }
    .have {
        padding-left: 0.2rem;
        padding-right: 0.2rem;
        text-align: center;
        width: 1.8rem;
    }
    .name {
        max-width: 15rem;
        text-align: left;
        width: 15rem;
    }
    .costs {
        --image-border-width: 1px;

        width: 4rem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{zoneName}</h5>
    <table class="table-striped">
        <tbody>
            {#each zoneData.items as { have, itemId, profession, quest, source }}
                {@const actualItemId = itemId || quest?.itemId || 0}
                {@const actualSource = source || quest?.source}
                <tr>
                    <td class="have" class:status-success={have} class:status-fail={!have}>
                        <YesNoIcon state={have} />
                    </td>
                    <td class="profession">
                        <ProfessionIcon id={profession} />
                    </td>

                    {#if actualItemId > 0}
                        {@const item = wowthingData.items.items[actualItemId]}
                        <td class="name quality{item.quality} text-overflow">
                            {item.name}
                        </td>
                    {:else}
                        <td class="name quality5">Profession Master</td>
                    {/if}

                    {#if quest?.costs?.length > 0}
                        <td class="costs" class:faded={have}>
                            {#each quest.costs as { amount, currencyId, itemId }}
                                {@const text = `{priceShort:${amount}|${itemId ? itemId + 1000000 : currencyId}}`}
                                <ParsedText {text} />
                            {/each}
                        </td>
                    {/if}

                    {#if actualSource && actualSource !== 'undefined'}
                        {@const renown = parseInt(actualSource.split(' ')[1])}
                        {#if renown}
                            <td
                                class="source"
                                class:status-fail={renown > characterRenown}
                                class:status-success={renown <= characterRenown}>R {renown}</td
                            >
                        {/if}
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>

    {#if reputationId || totalCosts.size > 0}
        <div class="bottom">
            {#if reputationId}
                <span>
                    {wowthingData.static.reputationById.get(reputationId).name}
                    {characterRenown}
                </span>
            {/if}

            {#if totalCosts.size > 0}
                {#each totalCosts as costId}
                    {@const amount =
                        costId > 1000000
                            ? character.getItemCount(costId - 1000000)
                            : character.currencies?.[costId]?.quantity || 0}
                    <ParsedText text={`{priceShort:${amount}|${costId}}`} />
                {/each}
            {/if}
        </div>
    {/if}
</div>
