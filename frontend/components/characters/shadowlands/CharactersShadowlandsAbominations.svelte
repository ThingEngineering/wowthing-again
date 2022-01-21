<script lang="ts">
    import some from 'lodash/some'

    import { abominations } from '@/data/covenant'
    import { userAchievementStore } from '@/stores'
    import type { Character } from '@/types'

    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let charAboms: [number, number, boolean][]
    $: {
        charAboms = []
        for (const [criteriaId, spellId] of abominations) {
            charAboms.push([
                criteriaId,
                spellId,
                some(
                    $userAchievementStore.data.criteria[criteriaId] || [],
                    ([charId, value]) => charId === character.id && value > 0
                )
            ])
        }
    }
</script>

<style lang="scss">
    .collection {
        border-width: 0;
        margin: 0 -0.25rem;
    }
    .collection-section {
        margin-bottom: -0.25rem;
        padding-bottom: 0;
        padding-left: 0.25rem;
    }
</style>

<div class="collection thing-container">
    <div class="collection-section">
        <div class="collection-objects">
            {#each charAboms as [criteriaId, spellId, charHas]}
                <div
                    class:missing={!charHas}
                >
                    <WowheadLink
                        type="{criteriaId === 88215 ? 'quest' : 'spell'}"
                        id={criteriaId === 88215 ? 61637 : spellId}
                    >
                        <WowthingImage
                            name="spell/{spellId}"
                            size={32}
                            border={1}
                        />
                    </WowheadLink>
                </div>
            {/each}
        </div>
    </div>
</div>
