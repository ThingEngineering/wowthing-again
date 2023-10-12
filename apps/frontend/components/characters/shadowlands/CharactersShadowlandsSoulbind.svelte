<script lang="ts">
    import find from 'lodash/find'

    import { soulbindSockets } from '@/data/icons'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { Character, CharacterShadowlandsSoulbind } from '@/types'
    import type { StaticDataSoulbind } from '@/shared/stores/static/types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import SpellLink from '@/shared/components/links/SpellLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let covenantId: number
    export let soulbind: StaticDataSoulbind

    let characterSoulbind: CharacterShadowlandsSoulbind
    let selectedTalent: number[][]
    $: {
        characterSoulbind = find(
            character.shadowlands?.covenants?.[covenantId]?.soulbinds || [],
            (sb) => sb.id === soulbind.id
        )
        selectedTalent = characterSoulbind?.tree ?? []
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
        background: $highlight-background;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        width: calc(2px + 3rem + (0.3rem * 2) + (52px * 3));

        &.inactive {
            border-color: $colour-fail;
            opacity: 0.5;
        }
        &.selected {
            border-color: $colour-success;
        }
    }
    .soulbind-row {
        display: flex;
        gap: 0.3rem;
        justify-content: space-between;

        &.none-chosen.unlocked {
            --image-border-color: #{$colour-fail};

            .empty-socket {
                border-color: $colour-fail;
            }
        }

        &:not(.none-chosen) {
            .soulbind-talent:not(.selected) {
                filter: grayscale(50%) opacity(75%);
            }
        }
    }
    .soulbind-talent {
        --image-border-radius: #{$border-radius-large};
        --image-border-width: 2px;

        height: 52px;
        position: relative;
        width: 52px;

        &.selected {
            --image-border-color: #{$colour-success};

            .empty-socket {
                border-color: $colour-fail;
            }
        }

        & :global(svg) {
            color: #eee;
            left: 50%;
            position: absolute;
            bottom: -12px;
            transform: scale(0.9) translateX(-50%);
            z-index: 10;
        }
    }
    .empty-socket {
        background: $thing-background;
        border: 2px solid $border-color;
        border-radius: $border-radius-large;
        height: 100%;
        width: 100%;
    }
</style>

<div
    class="soulbind thing-container border"
    class:selected={character.shadowlands?.soulbindId === soulbind.id}
    class:inactive={characterSoulbind?.unlocked !== true}
>
    <h3
        class="text-overflow"
        use:basicTooltip={`${soulbind.name}${characterSoulbind?.unlocked !== true ? ' [not unlocked]' : ''}`}
    >{soulbind.name}</h3>

    {#each soulbind.rows as row, rowIndex}
        <div
            class="soulbind-row"
            class:none-chosen={selectedTalent[rowIndex] === undefined}
            class:unlocked={character.shadowlands?.covenants?.[covenantId]?.renown >= soulbind.renown[rowIndex]}
        >
            {#if row.length === 1}
                <div class="soulbind-talent"></div>
            {/if}

            {#each row as column}
                <div
                    class="soulbind-talent"
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
                                    icon={soulbindSockets[column[1]]}
                                />
                            </SpellLink>
                        {:else}
                            <div
                                class="empty-socket"
                                use:basicTooltip={"Empty socket"}
                            >
                                <IconifyIcon
                                    dropShadow={true}
                                    icon={soulbindSockets[column[1]]}
                                />
                            </div>
                        {/if}
                    {/if}
                </div>
            {/each}

            {#if row.length === 1}
                <div class="soulbind-talent"></div>
            {/if}
        </div>
    {/each}
</div>
