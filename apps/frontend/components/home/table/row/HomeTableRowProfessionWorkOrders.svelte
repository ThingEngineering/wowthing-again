<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { lazyStore } from '@/stores'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/profession-cooldowns/TooltipProfessionCooldowns.svelte'

    export let character: Character

    $: data = $lazyStore.characters[character.id].professionWorkOrders
</script>

<style lang="scss">
    td {
        @include cell-width(2rem, $maxWidth: 4rem);

        border-left: 1px solid $border-color;
        text-align: right;
        word-spacing: -0.2ch;
    }
    .faded {
        color: #aaa;
    }
</style>

{#if data?.total > 0}
    <td
        class:status-shrug={data.anyHalf && !data.anyFull}
        class:status-fail={data.anyFull}
        class:faded={data.have === 0}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                cooldowns: data.cooldowns,
            },
        }}
    >
        {#if data.total > 0}
            {data.have} / {data.total}
        {/if}
    </td>
{:else}
    <td></td>
{/if}
