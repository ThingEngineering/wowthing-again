<script lang="ts">
    import some from 'lodash/some'

    import { abominations, CovenantAbomination } from '@/data/covenant'
    import { itemStore, userAchievementStore } from '@/stores'
    import tippy from '@/utils/tippy'
    import type { Character, CharacterShadowlandsCovenantFeature } from '@/types'

    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let feature: CharacterShadowlandsCovenantFeature

    let charAboms: [CovenantAbomination, boolean][]
    $: {
        charAboms = []
        if ($userAchievementStore.loaded) {
            for (const abomination of abominations) {
                charAboms.push([
                    abomination,
                    some(
                        $userAchievementStore.criteria[abomination.criteriaId] || [],
                        ([charId, value]) => charId === character.id && value > 0
                    )
                ])
            }
        }
    }
</script>

<style lang="scss">
    .collection {
        border-width: 0;
        margin: 0.5rem -0.25rem 0 -0.25rem;
    }
    .collection-section {
        margin-bottom: -0.25rem;
        padding-bottom: 0;
        padding-left: 0.25rem;
    }
    .not-buildable {
        filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(300%) contrast(0.9);
    }
    .abomination {
        --image-border-width: 2px;
    }
    .costs {
        --image-margin-top: -4px;

        text-align: right;
        width: 100%;
    }
    .cost.status-success {
        filter: saturate(200%) contrast(200%);
    }
    .currencies {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        border: 2px solid $colour-shrug;
        border-radius: $border-radius;
        height: 52px;
        padding: 0 0.2rem;
        text-align: right;
        width: 52px;
    }
    .status-success {
        --image-border-color: #{darken($colour-success, 10%)};
    }
</style>

<div class="collection thing-container">
    <div class="collection-section">
        <div class="collection-objects">
            {#each charAboms as [abomination, charHas]}
                {@const canBuild = feature?.rank >= abomination.requiredRank}
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
                    </WowheadLink>

                    {#if !charHas}
                        <div class="costs">
                            <div
                                class="cost"
                                class:status-success={character.getItemCount(178061) >= abomination.flesh}
                                use:tippy={`${abomination.flesh}x ${$itemStore.items[178061].name}`}
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
                                    use:tippy={`${abomination.parts}x ${$itemStore.items[183744].name}`}
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
            {/each}

            {#if feature?.rank > 0}
                <div style="width:52px"></div>

                <div class="currencies">
                    <div
                        class="currency"
                        use:tippy={`${character.getItemCount(178061)}x ${$itemStore.items[178061].name}`}
                    >
                        {character.getItemCount(178061)}
                        <WowthingImage
                            name="item/178061"
                            size={16}
                            border={1}
                        />
                    </div>
                    <div
                        class="currency"
                        use:tippy={`${character.getItemCount(183744)}x ${$itemStore.items[183744].name}`}
                    >
                        {character.getItemCount(183744)}
                        <WowthingImage
                            name="item/183744"
                            size={16}
                            border={1}
                        />
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
