<script lang="ts">
    import some from 'lodash/some'

    import { abominations, CovenantAbomination } from '@/data/covenant'
    import { itemStore, userAchievementStore } from '@/stores'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { Character, CharacterShadowlandsCovenantFeature } from '@/types'

    import Abomination from './Abomination.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

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
    .currencies {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        border: 2px solid $color-shrug;
        border-radius: $border-radius;
        height: 52px;
        padding: 0 0.2rem;
        text-align: right;
        width: 52px;
    }
</style>

<div class="collection thing-container">
    <div class="collection-section">
        <div class="collection-objects">
            {#each charAboms as [abomination, charHas]}
                <Abomination
                    {abomination}
                    {character}
                    {charHas}
                    {feature}
                />
            {/each}

            {#if feature?.rank > 0}
                <div style="width:52px"></div>

                <div class="currencies">
                    <div
                        class="currency"
                        use:basicTooltip={`${character.getItemCount(178061)}x ${$itemStore.items[178061].name}`}
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
                        use:basicTooltip={`${character.getItemCount(183744)}x ${$itemStore.items[183744].name}`}
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
