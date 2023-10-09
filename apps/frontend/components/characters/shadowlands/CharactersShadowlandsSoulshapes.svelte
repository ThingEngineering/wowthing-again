<script lang="ts">
    import { userQuestStore } from '@/stores'

    import { crittershapes, shapeTooltip, soulshapes } from '@/data/covenant'
    import { UserCount, type Character } from '@/types'

    import Count from '@/components/collectible/CollectibleCount.svelte'
    import WowheadLink from '@/shared/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/images/sources/WowthingImage.svelte'

    export let character: Character

    let allShapes: [questId: number, icon: string, has: boolean][][]
    let stats: UserCount
    $: {
        allShapes = []
        stats = new UserCount()

        for (const shapesArray of [soulshapes, crittershapes]) {
            const temp: [questId: number, icon: string, has: boolean][] = []
            for (const [questId, icon] of shapesArray) {
                const has = $userQuestStore.characters[character.id]?.quests?.has(questId)
                if (has) {
                    stats.have++
                }
                stats.total++

                temp.push([
                    questId,
                    icon,
                    has,
                ])
            }
            allShapes.push(temp)
        }
    }
</script>

<style lang="scss">
    h3 {
        border-bottom: 1px dashed $border-color;
        padding-bottom: 0.2rem;

        a {
            float: right;
            font-size: 1rem;
            margin-top: 2px;
        }
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
        gap: 0.35rem;
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
    <h3>
        Soulshapes
        <Count counts={stats} />
        <a href="https://www.wowhead.com/guides/soulshapes-night-fae-covenant">Guide</a>
    </h3>
    <div class="collection-section">
        {#each allShapes as shapes}
            <div class="collection-objects">
                {#each shapes as [questId, icon, has]}
                    <div
                        class="collection-object"
                        class:missing={!has}
                    >
                        <WowheadLink
                            type="quest"
                            id={questId}
                        >
                            <WowthingImage
                                name={icon}
                                size={32}
                                border={1}
                                tooltip={shapeTooltip[questId]}
                            />
                        </WowheadLink>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
