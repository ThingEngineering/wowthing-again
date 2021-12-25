<script lang="ts">
    import mdiLightningBoltOutline from '@iconify/icons-mdi/lightning-bolt-outline'
    import mdiShieldHalfFull from '@iconify/icons-mdi/shield-half-full'
    import mdiSwordCross from '@iconify/icons-mdi/sword-cross'
    import find from 'lodash/find'

    import type { CharacterShadowlandsSoulbind, StaticDataSoulbind } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import SpellLink from '@/components/links/SpellLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import { Character } from '@/types'

    export let character: Character
    export let covenantId: number
    export let soulbind: StaticDataSoulbind

    let selectedTalent: number[][]
    $: {
        const characterSoulbind: CharacterShadowlandsSoulbind = find(
            character.shadowlands?.covenants[covenantId]?.soulbinds || [],
            (sb) => sb.id === soulbind.id
        )
        selectedTalent = characterSoulbind?.tree ?? []

        console.log({covenantId, soulbind, character, selectedTalent})
    }

    const socketMap: Record<number, any> = {
        1: mdiLightningBoltOutline, // Finesse
        2: mdiSwordCross, // Potency
        3: mdiShieldHalfFull, // Endurance
    }
    const itemLevel: number[] = [
        0,
        145,
        158,
        171,
        184,
        200,
        213,
        226,
        239,
        252,
    ]
</script>

<style lang="scss">
    h3 {
        text-align: center;
    }
    .soulbind {
        padding: 1rem 2rem;
        width: 16rem;

        &.selected {
            border-color: $colour-success;
        }
    }
    .soulbind-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 1rem;

        &:not(.none-chosen) {
            .soulbind-column:not(.selected) {
                filter: grayscale(50%) opacity(75%);
            }
        }
    }
    .soulbind-column {
        --image-border-radius: #{$border-radius-large};
        --image-border-width: 2px;

        &.selected {
            --image-border-color: #{$colour-success};

            .conduit-socket {
                border-color: $colour-success;
            }
        }
    }
    .conduit-socket {
        background: $highlight-background;
        border: 2px solid $border-color;
        border-radius: $border-radius-large;
        height: 52px;
        position: relative;
        width: 52px;

        & :global(svg) {
            color: #eee;
            left: 50%;
            position: absolute;
            bottom: -16px;
            transform: scale(0.9) translateX(-50%);
        }
    }
</style>

<div
    class="soulbind thing-container border"
    class:selected={character.shadowlands?.soulbindId === soulbind.id}
>
    <h3 class="text-overflow">{soulbind.name}</h3>

    {#each soulbind.rows as row, rowIndex}
        <div
            class="soulbind-row"
            class:none-chosen={selectedTalent[rowIndex] === undefined}
        >
            {#if row.length === 1}
                <div class="soulbind-column"></div>
            {/if}

            {#each row as column}
                <div
                    class="soulbind-column"
                    class:selected={selectedTalent[rowIndex]?.[0] === column[0] + 1}
                >
                    {#if column[1] > 3}
                        <SpellLink id={column[1]}>
                            <WowthingImage
                                name="spell/{column[1]}"
                                size={48}
                                border={2}
                            />
                        </SpellLink>
                    {:else}
                        <div class="conduit-socket">
                            {#if selectedTalent[rowIndex]?.[0] === column[0] + 1 && selectedTalent[rowIndex][1] > 0}
                                <SpellLink
                                    id={selectedTalent[rowIndex][1]}
                                    itemLevel={itemLevel[selectedTalent[rowIndex][2]]}
                                >
                                    <WowthingImage
                                        name="spell/{selectedTalent[rowIndex][1]}"
                                        size={48}
                                        border={2}
                                    />
                                    <IconifyIcon
                                        dropShadow={true}
                                        icon={socketMap[column[1]]}
                                    />
                                </SpellLink>
                            {:else}
                                <IconifyIcon
                                    dropShadow={true}
                                    icon={socketMap[column[1]]}
                                />
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}

            {#if row.length === 1}
                <div class="soulbind-column"></div>
            {/if}
        </div>
    {/each}
</div>
