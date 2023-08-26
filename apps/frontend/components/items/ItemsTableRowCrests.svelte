<script lang="ts">
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'
    
    import Tooltip from '@/components/tooltips/parsed-text/TooltipParsedText.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    const pairs: number[][][] = [
        [
            [ 204075, 204193 ], // Whelpling
            [ 204076, 204195 ], // Drake
        ],
        [
            [ 204077, 204196 ], // Wyrm
            [ 204078, 204194 ], // Aspect
        ],
    ]
</script>

<style lang="scss">
    .crests {
        border-left: 1px solid $border-color;
        padding: 0 0.4rem 0 0.2rem;
    }
    .crests-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
        height: 100%;
    }
    .crest {
        line-height: 1;
    }
    .amount {
        display: inline-block;
        text-align: right;
        width: 1.2rem;
    }
    .faded {
        opacity: 0.5;
    }
</style>

<td class="spacer"></td>

{#each pairs as pair}
    <td class="crests">
        <div class="crests-wrapper">
            {#each pair as [fragmentId, crestId]}
                {@const fragments = character.getItemCount(fragmentId)}
                {@const crests = Math.floor(fragments / 15) + character.getItemCount(crestId)}
                <div
                    class="crest"
                    use:tippyComponent={{
                        component: Tooltip,
                        props: {
                            content: `{item:${crestId}}`,
                        },
                    }}
                >
                    <WowthingImage
                        border={1}
                        name={`item/${crestId}`}
                        size={16}
                    />
                    <span
                        class="amount"
                        class:faded={crests === 0}
                    >
                        {crests}
                    </span>
                    <span class="faded">/</span>
                    <span
                        class="amount"
                        class:faded={fragments % 15 === 0}
                    >
                        {fragments % 15}
                    </span>
                </div>
            {/each}
        </div>
    </td>
{/each}
