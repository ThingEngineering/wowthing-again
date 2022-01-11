<script lang="ts">
    import { Constants } from '@/data/constants'
    import { covenantMap, covenantOrder } from '@/data/covenant'
    import { data as settingsData } from '@/stores/settings'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, CharacterShadowlandsCovenant, Covenant } from '@/types'

    import Tooltip from '@/components/tooltips/covenant/TooltipCovenant.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character = undefined

    let characterCovenants: Record<number, CharacterShadowlandsCovenant>
    let covenant: Covenant
    $: {
        characterCovenants = character?.shadowlands?.covenants || {}
        covenant = covenantMap[character?.shadowlands?.covenantId]
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;

        &.current {
            @include cell-width($width-covenant);
        }
        &.all {
            @include cell-width($width-covenant-all);

            .flex-wrapper {
                gap: calc(0.4rem - 4px);
                justify-content: center;

                span {
                    display: inline-block;
                    text-align: center;
                    width: 26px;

                    &.active {
                        border: 1px solid $colour-shrug;
                        border-radius: $border-radius;
                        line-height: 1.3;
                    }
                }
            }
        }
    }
</style>

<td
    class="{$settingsData.layout.covenantColumn}"
    use:tippyComponent={{
        component: Tooltip,
        props: { character },
    }}
>
    {#if covenant !== undefined}
        <div class="flex-wrapper">
            {#if $settingsData.layout.covenantColumn === 'current'}
                <WowthingImage name={covenant.icon} size={20} border={1} />
                <span
                    class:status-success={character.shadowlands.renownLevel >= Constants.maxRenown}
                >{character.shadowlands.renownLevel}</span>
            {:else}
                {#each covenantOrder as covenantId}
                    {#if characterCovenants[covenantId]}
                        <span
                            class:active={covenantId === character.shadowlands?.covenantId}
                            class:status-success={characterCovenants[covenantId].renown === Constants.maxRenown}
                        >{characterCovenants[covenantId].renown}</span>
                    {:else}
                        <span class="status-fail">---</span>
                    {/if}
                {/each}
            {/if}
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
