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
    }

    $: options = sortBy($userStore.activeCharacters, (char) => `${char.realm.slug}|${char.name}`)
        .map((char) => ({
            id: char.id,
            label: `${char.name}-${char.realm.name}`,
        })) as CharacterOption[];
    $: optionMap = Object.fromEntries(options.map((option) => [option.id, option]));

    function maybeOption(id: number) {
        const option = optionMap[$settingsStore.professions.collectingCharacters[id]];
        return option ? [option] : [];
    }

    let selected: Record<number, CharacterOption[]>
    $: selected = Object.fromEntries(
        sortedProfessions.map((prof) => [
            prof.id,
            maybeOption(prof.id)
        ])
    );
</script>

<style lang="scss">
    table {
        --image-border-width: 1px;
        --image-margin-top: -4px;
        --sms-li-active-bg: #{$active-background};
        --sms-options-bg: #{$tooltip-background};
        --sms-options-border: 1px solid #{$tooltip-border};
        --sms-placeholder-color: #bbb;
        --sms-selected-li-padding: 0 0.2rem;

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
    <p>Which specific character to use when checking if a recipe has been collected.</p>
    
    <table class="table table-striped">
        <tbody>
            {#each sortedProfessions as profession}
                <tr>
                    <td class="name">
                        <ProfessionIcon
                            id={profession.id}
                            size={16}
                            border={1}
                        />
                        {getGenderedName(profession.name)}
                    </td>
                    <td class="character">
                        <MultiSelect
                            maxSelect={1}
                            options={options.filter((option) => !!$userStore.characterMap[option.id].professions?.[profession.id])}
                            placeholder={'Any character'}
                            bind:selected={selected[profession.id]}
                            on:change={() => {
                                if (selected[profession.id].length > 0) {
                                    $settingsStore.professions.collectingCharacters[profession.id] = selected[profession.id][0].id
                                } else {
                                    $settingsStore.professions.collectingCharacters[profession.id] = 0
                                }
                            }}
                        />
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
