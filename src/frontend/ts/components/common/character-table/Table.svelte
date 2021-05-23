<script lang="ts">
    import filter from 'lodash/filter'
    import sumBy from 'lodash/sumBy'
    import {setContext} from 'svelte'

    import {data as settings} from '../../../stores/settings-store'
    import {data as userData} from '../../../stores/user-store'
    import type {Character} from '../../../types'

    import CharacterRow from './Row.svelte'

    export let extraSpan: string = '0'
    export let endSpacer: boolean = true
    export let filterFunc: (char: Character) => boolean = (c) => true

    setContext('endSpacer', endSpacer)

    $: characters = filter($userData.characters, filterFunc)

    const span = 6 + sumBy([
        $settings.General.ShowRealm,
    ], (setting) => Number(setting))
</script>

<style lang="scss">
    @import '../../../../scss/variables';

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
        <colgroup span="{span + parseInt(extraSpan)}"></colgroup>
        <slot name="colgroup" />
        <slot name="head" />
        <tbody>
            {#each characters as character}
                <CharacterRow {character}>
                    <slot slot="rowExtra" name="rowExtra" />
                </CharacterRow>
            {/each}
        </tbody>
    </table>
</div>
