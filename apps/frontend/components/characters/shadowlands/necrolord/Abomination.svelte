<script lang="ts">
    import { classIdToArmorType } from '@/data/character-class'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { itemStore, userTransmogStore } from '@/stores'
    import type { CovenantAbomination } from '@/data/covenant'
    import type { Character, CharacterShadowlandsCovenantFeature } from '@/types'

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let abomination: CovenantAbomination
    export let character: Character
    export let charHas: boolean
    export let feature: CharacterShadowlandsCovenantFeature

    $: canBuild = feature?.rank >= abomination.requiredRank

    let questItemId: number
    let userHasQuestItem: boolean
    $: {
        questItemId = 0
        userHasQuestItem = false
        if (abomination.itemIds) {
            const itemIndex = classIdToArmorType[character.classId] - 1
            questItemId = abomination.itemIds[itemIndex]
            userHasQuestItem = $userTransmogStore.hasSource.has(`${questItemId}_0`)
        }
    }
</script>

<style lang="scss">
    .abomination {
        --collected-right: -4px;
        --collected-top: -5px;
        --image-border-width: 2px;
        --scale: 1.2;

        :global(> a) {
            display: block;
            height: 52px;
            position: relative;
        }
    }
    .not-buildable {
        filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(300%) contrast(0.9);
    }
    .costs {
        --image-margin-top: -4px;

        text-align: right;
        width: 100%;
    }
    .cost.status-success {
        filter: saturate(200%) contrast(200%);
    }
    .status-success {
        --image-border-color: #{darken($color-success, 10%)};
    }
    .quest-item {
        --image-border-color: #{$quality4-color};

        position: absolute;
        top: -5px;
        right: -3px;
    }
</style>

<div
    class="abomination"
    class:missing={canBuild && !charHas}
    class:not-buildable={!canBuild}
    class:status-success={charHas}
>
    <WowheadLink
        type="{abomination.criteriaId === 88215 ? 'quest' : 'spell'}"
        id={abomination.criteriaId === 88215 ? 61637 : abomination.spellId}
    >
        <WowthingImage
            name="spell/{abomination.spellId}"
            size={48}
            border={2}
        />

        {#if questItemId}
            {#if userHasQuestItem}
                <CollectedIcon />
            {:else}
                <span class="quest-item drop-shadow">
                    <WowheadLink
                        type={'item'}
                        id={questItemId}
                    >
                        <WowthingImage
                            name="item/{questItemId}"
                            size={20}
                            border={2}
                        />
                    </WowheadLink>
                </span>
            {/if}
        {/if}
    </WowheadLink>

    {#if !charHas}
        <div class="costs">
            <div
                class="cost"
                class:status-success={character.getItemCount(178061) >= abomination.flesh}
                use:basicTooltip={`${abomination.flesh}x ${$itemStore.items[178061].name}`}
            >
                {abomination.flesh}
                <WowthingImage
                    name="item/178061"
                    size={16}
                    border={1}
                />
            </div>

            {#if abomination.parts > 0}
                <div
                    class="cost"
                    class:status-success={character.getItemCount(183744) >= abomination.parts}
                    use:basicTooltip={`${abomination.parts}x ${$itemStore.items[183744].name}`}
                >
                    {abomination.parts}
                    <WowthingImage
                        name="item/183744"
                        size={16}
                        border={1}
                    />
                </div>
            {/if}
        </div>
    {/if}
</div>
