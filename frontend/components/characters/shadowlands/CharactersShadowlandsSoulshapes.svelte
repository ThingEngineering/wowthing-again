<script lang="ts">
    import { userQuestStore } from '@/stores'

    import { crittershapes, soulshapes } from '@/data/covenant'
    import type { Character } from '@/types'

    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
</script>

<style lang="scss">
    h3 a {
        float: right;
        font-size: 1rem;
        margin-top: 2px;
    }
    .collection {
        border-width: 0;
        margin: 0 -0.25rem;
    }
    .collection-section {
        margin-bottom: -0.25rem;
        padding-bottom: 0;
        padding-left: 0.25rem;
    }
    .collection-objects {
        gap: 0.25rem;
    }
    .collection-objects + .collection-objects {
        margin-top: 0.5rem;
    }
    .collection-object {
        --image-border-color: #{$colour-success};
        --image-border-width: 1px;

        &.missing {
            --image-border-color: #{$border-color};
        }
    }
</style>

<div class="collection thing-container">
    <h3 class="border">
        Soulshapes
        <a href="https://www.wowhead.com/guides/soulshapes-night-fae-covenant">Wowhead guide</a>
    </h3>
    <div class="collection-section">
        <div class="collection-objects">
            {#each soulshapes as [questId, icon]}
                <div
                    class="collection-object"
                    class:missing={!$userQuestStore.data.characters[character.id]?.quests?.has(questId)}
                >
                    <WowheadLink
                        type="quest"
                        id={questId}
                    >
                        <WowthingImage
                            name={icon}
                            size={32}
                            border={1}
                        />
                    </WowheadLink>
                </div>
            {/each}
        </div>

        <div class="collection-objects">
            {#each crittershapes as [questId, icon]}
                <div
                    class="collection-object"
                    class:missing={!$userQuestStore.data.characters[character.id]?.quests?.has(questId)}
                >
                    <WowheadLink
                        type="quest"
                        id={questId}
                    >
                        <WowthingImage
                            name={icon}
                            size={32}
                            border={1}
                        />
                    </WowheadLink>
                </div>
            {/each}
        </div>
    </div>
</div>
