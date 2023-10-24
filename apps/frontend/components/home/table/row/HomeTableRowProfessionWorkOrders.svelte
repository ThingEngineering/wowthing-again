<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { professionIdToSlug } from '@/data/professions'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { lazyStore } from '@/stores'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/profession-cooldowns/TooltipProfessionCooldowns.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character

    $: data = $lazyStore.characters[character.id].professionWorkOrders
</script>

<style lang="scss">
    td {
        @include cell-width(5.5rem, $maxWidth: 4rem);

        border-left: 1px solid $border-color;
        text-align: right;
        word-spacing: -0.2ch;
    }
    .flex-wrapper {
        width: 100%;
    }
    .faded {
        opacity: 0.7;
    }
    .cooldown {
        align-items: center;
        display: flex;
        justify-content: space-between;
    
        span {
            display: block;
            text-align: right;
            width: 1.0rem;
        }
    }
</style>

{#if data?.total > 0}
    <td
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                cooldowns: data.cooldowns,
            },
        }}
    >
        <div class="flex-wrapper">
            {#each data.cooldowns as cooldown}
                <div
                    class="cooldown"
                    class:faded={cooldown.have === 0}
                    class:status-shrug={cooldown.have > 0 && cooldown.have < cooldown.max}
                    class:status-fail={cooldown.have === cooldown.max}
                >
                    <WowthingImage
                        name="{imageStrings[professionIdToSlug[cooldown.data.profession]]}"
                        size={20}
                        border={1}
                    />
                    <span>{cooldown.have}</span>
                </div>
            {/each}
        </div>
    </td>
{:else}
    <td></td>
{/if}
