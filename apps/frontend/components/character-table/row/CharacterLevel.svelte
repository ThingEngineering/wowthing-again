<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/character-level/TooltipCharacterLevel.svelte'

    export let character: Character
</script>

<style lang="scss">
    code {
        line-height: 1;
        background: none;
    }
    // .level {
    //     @include cell-width($width-level);

    //     text-align: right;
    // }
    .level-partial {
        @include cell-width($width-level-partial);

        text-align: right;
    }
</style>

<td
    class="level-partial"
    use:componentTooltip={{
        component: Tooltip,
        props: {
            character,
        },
    }}
>
    <code>{@html character.fancyLevel}</code>
</td>
