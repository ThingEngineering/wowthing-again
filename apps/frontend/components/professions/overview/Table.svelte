<script lang="ts">
    import { imageStrings } from '@/data/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { leftPad } from '@/utils/formatting/left-pad';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { Character } from '@/types';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import Profession from './TableProfession.svelte';
    import ProfessionSpecializationIcon from '@/shared/components/icons/ProfessionSpecializationIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        characterIds?: number[];
        profession: StaticDataProfession;
    };
    let { characterIds, profession }: Props = $props();

    let filterFunc = $derived(
        (profession
            ? (char) =>
                  !!char.professions?.[profession.id] &&
                  (!characterIds || characterIds.includes(char.id))
            : () => false) as (char: Character) => boolean
    );

    let sortFunc = $derived(
        (characterIds?.length > 0
            ? (char) => leftPad(characterIds.indexOf(char.id), 2, '0')
            : undefined) as (char: Character) => string
    );
</script>

<style lang="scss">
    .profession-head {
        padding: 0.3rem;
    }
    td,
    th {
        --width: 4rem;

        border-left: 1px solid var(--border-color);
        text-align: center;
    }
    .specialization {
        --width: 13rem;
    }
    td.specialization {
        text-align: left;
    }
</style>

{#if profession}
    <CharacterTable {filterFunc} {sortFunc}>
        <CharacterTableHead slot="head">
            {#snippet headText()}
                <WowthingImage name={imageStrings[profession.slug]} size={20} border={1} />
                {profession.name.split('|')[0]}
            {/snippet}

            {#if profession.slug === 'archaeology'}
                <th class="profession-head">Ugh</th>
            {:else}
                {#each settingsState.expansions as expansion (expansion.id)}
                    <th class="profession-head">{expansion.shortName}</th>
                {/each}
            {/if}

            {#if ['alchemy', 'engineering'].includes(profession.slug)}
                <th class="profession-head specialization">Specialization</th>
            {/if}
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            {#each settingsState.expansions as expansion (expansion.id)}
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
                        <ProfessionSpecializationIcon
                            {character}
                            professionId={profession.id}
                            includeText={true}
                        />
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
