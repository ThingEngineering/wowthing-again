<script lang="ts">
    import { Region } from '@/enums/region';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/character-name/TooltipCharacterName.svelte';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        --max-width: var(--width-name-max);
        --width: var(--width-name);

        white-space: nowrap;
    }
</style>

<td
    class="max-width"
    use:componentTooltip={{
        component: Tooltip,
        props: {
            character,
        },
    }}
>
    <a
        class="{settingsState.value.layout.useClassColors
            ? `class-${character.classId}`
            : ''} drop-shadow"
        href="#/characters/{Region[character.realm?.region || Region.US].toLowerCase()}-{character
            .realm.slug}/{character.name}/paperdoll"
    >
        {character.name}
    </a>
</td>
