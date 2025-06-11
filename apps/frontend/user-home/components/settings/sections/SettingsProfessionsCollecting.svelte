<script lang="ts">
    import sortBy from 'lodash/sortBy';
    import MultiSelect from 'svelte-multiselect';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import type { StaticDataProfession } from '@/shared/stores/static/types';

    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';

    let { sortedProfessions }: { sortedProfessions: StaticDataProfession[] } = $props();

    // export let sortedProfessions: StaticDataProfession[];

    type CharacterOption = {
        id: number;
        label: string;
    };

    let options = $derived.by(
        () =>
            sortBy(
                userState.general.activeCharacters,
                (char) => `${char.realm.slug}|${char.name}`
            ).map((char) => ({
                id: char.id,
                label: `${char.name}-${char.realm.name}`,
            })) as CharacterOption[]
    );
    let optionMap = $derived.by(() =>
        Object.fromEntries(options.map((option) => [option.id, option]))
    );

    let selected: Record<number, CharacterOption[]> = $derived.by(() =>
        Object.fromEntries(sortedProfessions.map((prof) => [prof.id, maybeOption(prof.id)]))
    );

    function maybeOption(id: number) {
        return (settingsState.value.professions.collectingCharactersV2[id] || [])
            .map((characterId) => optionMap[characterId])
            .filter((id) => !!id);
    }
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
            {#each sortedProfessions as profession (profession.id)}
                <tr>
                    <td class="name">
                        <ProfessionIcon id={profession.id} size={16} border={1} />
                        {getGenderedName(profession.name)}
                    </td>
                    <td class="character">
                        <MultiSelect
                            options={options.filter(
                                (option) =>
                                    !!userState.general.characterById[option.id].professions?.[
                                        profession.id
                                    ]
                            )}
                            placeholder="Any character"
                            bind:selected={selected[profession.id]}
                            onchange={(event) => {
                                if (event?.type === 'removeAll') {
                                    selected[profession.id] = [];
                                }
                                settingsState.value.professions.collectingCharactersV2[
                                    profession.id
                                ] = selected[profession.id].map((option) => option.id);
                            }}
                        />
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
