<script lang="ts">
    import { Region } from '@/enums/region'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { settingsStore } from '@/shared/stores/settings'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/character-name/TooltipCharacterName.svelte'

    export let character: Character
</script>

<style lang="scss">
    td {
        @include cell-width($width-name, $maxWidth: $width-name-max);

        white-space: nowrap;
    }
    a {
        color: var(--colour-class, var(--link-color));
    }
</style>

<td
    use:componentTooltip={{
        component: Tooltip,
        props: {
            character,
        }
    }}
>
    <a
        class="{$settingsStore.layout.useClassColors ? `class-${character.classId}` : ''} drop-shadow"
        href="#/characters/{Region[character.realm.region].toLowerCase()}-{character.realm.slug}/{character.name}/paperdoll"
    >
        {character.name}
    </a>
</td>
