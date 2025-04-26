<script lang="ts">
    import sortBy from 'lodash/sortBy';
    import MultiSelect from 'svelte-multiselect';

    import { settingsStore } from '@/shared/stores/settings';
    import { userStore } from '@/stores';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import type { StaticDataProfession } from '@/shared/stores/static/types';

    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';

    export let sortedProfessions: StaticDataProfession[];

    type CharacterOption = {
        id: number;
        label: string;
    };

    $: options = sortBy(
        $userStore.activeCharacters,
        (char) => `${char.realm.slug}|${char.name}`,
    ).map((char) => ({
        id: char.id,
        label: `${char.name}-${char.realm.name}`,
    })) as CharacterOption[];
    $: optionMap = Object.fromEntries(options.map((option) => [option.id, option]));

    function maybeOption(id: number) {
        return ($settingsStore.professions.collectingCharactersV2[id] || [])
            .map((characterId) => optionMap[characterId])
            .filter((id) => !!id);
    }

    let selected: Record<number, CharacterOption[]>;
    $: selected = Object.fromEntries(
        sortedProfessions.map((prof) => [prof.id, maybeOption(prof.id)]),
    );
</script>

<style lang="scss">
    table {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        margin-bottom: 1rem;
        // This is goofy but I can't work out how to have the dropdown extend outside the table
        padding-bottom: calc((var(--column-count) - 1) * 10rem);
    }
    tbody tr:first-child td {
        border-top: 1px solid $border-color;
    }
    td {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
    }
    .name {
        @include cell-width(10rem);
    }
    .character {
        @include cell-width(20rem);

        :global(ul.selected) {
            flex-wrap: none;
        }
        :global(ul.selected > li) {
            margin-top: 1px;
        }
    }
</style>

<div class="settings-block">
    <h3>Collecting</h3>
    <p>
        Which specific characters to use when checking if a recipe has been collected. Any secondary
        characters are checked if the primary is unable to learn the recipe.
    </p>

    <table class="table table-striped">
        <tbody>
            {#each sortedProfessions as profession}
                <tr>
                    <td class="name">
                        <ProfessionIcon id={profession.id} size={16} border={1} />
                        {getGenderedName(profession.name)}
                    </td>
                    <td class="character">
                        <MultiSelect
                            options={options.filter(
                                (option) =>
                                    !!$userStore.characterMap[option.id].professions?.[
                                        profession.id
                                    ],
                            )}
                            placeholder={'Any character'}
                            bind:selected={selected[profession.id]}
                            on:change={(event) => {
                                if (event?.detail?.type === 'removeAll') {
                                    selected[profession.id] = [];
                                }
                                $settingsStore.professions.collectingCharactersV2[profession.id] =
                                    selected[profession.id].map((option) => option.id);
                            }}
                        />
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
