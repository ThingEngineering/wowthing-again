<script lang="ts">
    import { classIdToArmorType } from '@/data/character-class';
    import { wowthingData } from '@/shared/stores/data';
    import type { CovenantAbomination } from '@/data/covenant';
    import type { Character, CharacterShadowlandsCovenantFeature } from '@/types';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { userState } from '@/user-home/state/user';

    export let abomination: CovenantAbomination;
    export let character: Character;
    export let charHas: boolean;
    export let feature: CharacterShadowlandsCovenantFeature;

    $: canBuild = feature?.rank >= abomination.requiredRank;

    let questItemId: number;
    let userHasQuestItem: boolean;
    $: {
        questItemId = 0;
        userHasQuestItem = false;
        if (abomination.itemIds) {
            const itemIndex = classIdToArmorType[character.classId] - 1;
            questItemId = abomination.itemIds[itemIndex];
            userHasQuestItem = userState.general.hasAppearanceBySource.has(questItemId * 1000);
        }
    }
</script>

<style lang="scss">
    .abomination {
        --collected-right: -1px;
        --collected-top: -2px;
        --image-border-width: 2px;
        --scale: 1.2;

        :global(> a) {
            display: block;
            height: 52px;
            position: relative;
        }
    }
    .not-buildable {
        filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(300%)
            contrast(0.9);
    }
    .costs {
        --image-margin-top: -4px;

        text-align: right;
        width: 100%;
    }
    .cost.status-success {
        filter: saturate(200%) contrast(200%);
    }
    .quest-item {
        --image-border-color: var(--quality4-color);

        position: absolute;
        top: -1px;
        right: 0;
    }
    .name {
        bottom: 1px;
    }
</style>

<div
    class="abomination"
    class:missing={canBuild && !charHas}
    class:not-buildable={!canBuild}
    class:border-fail={!charHas && questItemId}
    class:status-shrug={charHas && questItemId && !userHasQuestItem}
    class:status-success={charHas && (!questItemId || userHasQuestItem)}
>
    <WowheadLink
        type={abomination.name === 'Unity' ? 'quest' : 'spell'}
        id={abomination.name === 'Unity' ? abomination.questId : abomination.spellId}
    >
        <WowthingImage name="spell/{abomination.spellId}" size={48} border={2} />

        {#if questItemId}
            {#if userHasQuestItem}
                <CollectedIcon />
            {:else}
                <span class="quest-item drop-shadow">
                    <WowheadLink type="item" id={questItemId}>
                        <WowthingImage name="item/{questItemId}" size={20} border={2} />
                    </WowheadLink>
                </span>
            {/if}
        {/if}

        {#if abomination.shortName}
            <span class="name pill abs-center">{abomination.shortName}</span>
        {/if}
    </WowheadLink>

    {#if !charHas}
        <div class="costs">
            <div
                class="cost"
                class:status-success={character.getItemCount(178061) >= abomination.flesh}
                data-tooltip={`${abomination.flesh}x ${wowthingData.items.items[178061].name}`}
            >
                {abomination.flesh}
                <WowthingImage name="item/178061" size={16} border={1} />
            </div>

            {#if abomination.parts > 0}
                <div
                    class="cost"
                    class:status-success={character.getItemCount(183744) >= abomination.parts}
                    data-tooltip={`${abomination.parts}x ${wowthingData.items.items[183744].name}`}
                >
                    {abomination.parts}
                    <WowthingImage name="item/183744" size={16} border={1} />
                </div>
            {/if}
        </div>
    {/if}
</div>
