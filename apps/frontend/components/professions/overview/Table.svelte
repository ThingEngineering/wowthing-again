<script lang="ts">
    import { imageStrings } from '@/data/icons';
    import { professionSpecializationSpells } from '@/data/professions';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { leftPad } from '@/utils/formatting/left-pad';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { Character } from '@/types';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import Profession from './TableProfession.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';

    export let characterIds: number[] = undefined;
    export let profession: StaticDataProfession;

    let filterFunc: (char: Character) => boolean;
    let sortFunc: (char: Character) => string;
    $: {
        if (profession) {
            filterFunc = (char) =>
                !!char.professions?.[profession.id] &&
                (!characterIds || characterIds.includes(char.id));
        } else {
            filterFunc = () => false;
        }

        sortFunc =
            characterIds?.length > 0
                ? (char) => leftPad(characterIds.indexOf(char.id), 2, '0')
                : undefined;
    }
</script>

<style lang="scss">
    .profession-head {
        padding: 0.3rem;
    }
    td,
    th {
        @include cell-width(4.5rem);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    .specialization {
        @include cell-width(12rem);
    }
    td.specialization {
        text-align: left;
    }
</style>

{#if profession}
    <CharacterTable {filterFunc} {sortFunc}>
        <CharacterTableHead slot="head">
            <svelte:fragment slot="headText">
                <WowthingImage name={imageStrings[profession.slug]} size={20} border={1} />
                {profession.name.split('|')[0]}
            </svelte:fragment>

            {#if profession.slug === 'archaeology'}
                <th class="profession-head">Ugh</th>
            {:else}
                {#each settingsState.expansions as expansion}
                    <th class="profession-head">{expansion.shortName}</th>
                {/each}
            {/if}

            {#if ['alchemy', 'engineering'].includes(profession.slug)}
                <th class="profession-head specialization">Specialization</th>
            {/if}
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            {#each settingsState.expansions as expansion}
                <Profession
                    primaryId={profession.id}
                    subId={profession.expansionSubProfession[expansion.id]?.id}
                    {character}
                />
            {/each}

            {#if ['alchemy', 'engineering'].includes(profession.slug)}
                {@const specId = character.professionSpecializations?.[profession.id]}
                <td class="specialization">
                    {#if specId}
                        <WowheadLink id={specId} type="spell">
                            <WowthingImage name="spell/{specId}" size={20} border={1} />
                            {professionSpecializationSpells[specId]}
                        </WowheadLink>
                    {:else}
                        No spec!
                    {/if}
                </td>
            {/if}
        </svelte:fragment>

        <tr slot="emptyRow">
            <td colspan="999">You have no characters with this profession.</td>
        </tr>
    </CharacterTable>
{/if}
