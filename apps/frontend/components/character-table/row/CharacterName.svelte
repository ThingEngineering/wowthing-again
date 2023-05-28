<script lang="ts">
    import { Region } from '@/enums'
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
</style>

<td
    use:tippyComponent={{
        component: Tooltip,
        props: {
            character,
        }
    }}
>
    <a href="#/characters/{Region[character.realm.region].toLowerCase()}-{character.realm.slug}/{character.name}">
        {character.name}
    </a>
</td>
