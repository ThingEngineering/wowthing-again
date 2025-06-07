<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/character-level/TooltipCharacterLevel.svelte';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
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
