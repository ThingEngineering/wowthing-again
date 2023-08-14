<script lang="ts">
    import { Region } from '@/enums'
    import { settingsStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
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
    use:tippyComponent={{
        component: Tooltip,
        props: {
            character,
        }
    }}
>
    <a
        class="{$settingsStore.layout.useClassColors ? `class-${character.classId}` : undefined}"
        href="#/characters/{Region[character.realm.region].toLowerCase()}-{character.realm.slug}/{character.name}"
    >
        {character.name}
    </a>
</td>
