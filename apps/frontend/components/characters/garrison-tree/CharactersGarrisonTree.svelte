<script lang="ts">
    import type { Character, GarrisonTree } from '@/types'

    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let tree: GarrisonTree

    let status: Record<number, number[]>
    $: {
        status = character.garrisonTrees?.[tree.id]
    }
</script>

<style lang="scss">
    .row {
        --image-border-radius: #{$border-radius-large};
        --image-border-width: 2px;

        display: flex;
        min-height: 40px;
    }
    .talent {
        align-items: center;
        display: flex;
        flex-direction: column;
        padding: 0.5rem 0;
        width: 7rem;

        &.bordered:not(:first-child) {
            border-left: 1px solid $border-color;
        }

        &.empty {
            padding: 0;
        }
        &.done {
            --image-border-color: #{$color-shrug};

            color: $color-shrug;
        }
        &.partial {
            --image-border-color: #{$color-success};

            color: $color-success;
        }
        &.prereq {
            --image-border-color: #{$color-fail};

            filter: opacity(70%);
        }
    }
    .rank {
        padding: 1px 3px 2px 3px;
        position: unset;
        transform: none;
        word-spacing: -0.1ch;
    }
</style>

{#each tree.tiers as tier}
    <div
        class="row"
        class:bordered={tree.direction === 'horizontal'}
    >
        {#each tier as talent}
            {@const hasRank = status?.[talent?.id]?.[0] || 0}
            {@const noRequired = talent?.requires > 0 && (status?.[talent?.requires]?.[0] || 0) === 0}
            {#if talent !== null}
                <div
                    class="talent"
                    class:bordered={tree.direction === 'vertical'}
                    class:done={hasRank === talent.ranks}
                    class:partial={hasRank > 0 && hasRank < talent.ranks}
                    class:prereq={noRequired}
                >
                    <WowheadLink
                        type="order-advancement"
                        id={talent.id}
                    >
                        <WowthingImage
                            name="garrison-talent/{talent.id}"
                            size={56}
                            border={2}
                        />
                    </WowheadLink>

                    {#if !noRequired && talent.ranks > 1}
                        <div class="pill rank">
                            {hasRank} / {talent.ranks}
                        </div>
                    {/if}
                </div>
            {:else}
                <div
                    class="talent empty"
                    class:bordered={tree.direction === 'vertical'}
                >
                </div>
            {/if}
        {/each}
    </div>
{/each}
