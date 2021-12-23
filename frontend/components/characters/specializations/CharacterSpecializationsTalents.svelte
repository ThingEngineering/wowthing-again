<script lang="ts">
    import find from 'lodash/find'

    import { staticStore } from '@/stores'
    import { specializationMap } from '@/data/character-specialization'
    import type { Character } from '@/types'

    import SpellLink from '@/components/links/SpellLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let specializationId: number

    let selectedTalent: number[][]
    $: {
        selectedTalent = $staticStore.data.talents[specializationId]
            .map((spellIds, tier) => find(
                spellIds,
                (spellId) => character.specializations?.[specializationId]?.[tier] === spellId
            ))
        console.log(selectedTalent)
    }
</script>

<style lang="scss">
    h3 {
        text-align: center;
    }
    .specialization {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;

        &.selected {
            border-color: #{$colour-success};
        }
    }
    .tier {
        display: flex;
        gap: 0.3rem;

        &.none-chosen {
            --image-border-color: #{$colour-fail};
        }
        &:not(.none-chosen) {
            .talent:not(.selected) {
                filter: grayscale(50%) opacity(75%);
            }
        }
    }
    .talent {
        --image-border-width: 2px;

        &.selected {
            --image-border-color: #{$colour-success};
        }
    }
</style>

<div
    class="specialization border"
    class:selected={character.activeSpecId === specializationId}
>
    <h3>{specializationMap[specializationId].name}</h3>

    {#each $staticStore.data.talents[specializationId] as tier, tierIndex}
        <div
            class="tier"
            class:none-chosen={selectedTalent[tierIndex] === undefined}
        >
            {#each tier as spellId}
                <div
                    class="talent"
                    class:selected={selectedTalent[tierIndex] === spellId}
                >
                    <SpellLink
                        id={spellId}
                    >
                        <WowthingImage
                            name="spell/{spellId}"
                            size={48}
                            border={2}
                        />
                    </SpellLink>
                </div>
            {/each}
        </div>
    {/each}
</div>
