<script lang="ts">
    import filter from 'lodash/filter'
    import sortBy from 'lodash/sortBy'
    import sumBy from 'lodash/sumBy'
    import {setContext} from 'svelte'

    import {data as settings} from '../../../stores/settings'
    import {data as userData} from '../../../stores/user'
    import type {Character} from '@/types'

    import CharacterRow from './Row.svelte'

    export let extraSpan: number = 0
    export let endSpacer: boolean = true
    export let filterFunc: (char: Character) => boolean = () => true
    export let sortFunc: (char: Character) => number = undefined

    setContext('endSpacer', endSpacer)

    let characters: Character[]
    $: {
        characters = filter($userData.characters, filterFunc)
        if (sortFunc) {
            characters = sortBy(characters, sortFunc)
        }
    }

    const span = 3 + sumBy([
        $settings.general.showRaceIcon,
        $settings.general.showClassIcon,
        $settings.general.showSpecIcon,
        $settings.general.showRealm,
    ], (setting) => Number(setting))
</script>

<style lang="scss">
    table {
        background: $thing-background;
        border-radius: $border-radius;
        table-layout: fixed;

        & :global(colgroup:nth-child(even)) {
            background: darken($thing-background, 3%);
        }

        & :global(thead th) {
            border-bottom: 1px solid $border-color;
            position: sticky;
            top: 0;
        }
        & :global(thead th:first-child) {
            border-top-left-radius: $border-radius;
        }
        & :global(thead th:last-child) {
            border-top-right-radius: $border-radius;
        }
        & :global(tbody td) {
            white-space: nowrap;
        }
        & :global(tbody tr:last-child td:first-child) {
            border-bottom-left-radius: $border-radius;
        }
        & :global(tbody tr:last-child td:last-child) {
            border-bottom-right-radius: $border-radius;
        }
    }
</style>

<div class="thing-container">
    <table class="table-striped">
        <colgroup span="{span + extraSpan}"></colgroup>
        <slot name="colgroup" />
        <slot name="head" />
        <tbody>
            {#each characters as character}
                {#key `${character.realmId}-${character.name}`}
                    <CharacterRow {character}>
                        <slot slot="rowExtra" name="rowExtra" />
                    </CharacterRow>
                {/key}
            {/each}
        </tbody>
    </table>
</div>
