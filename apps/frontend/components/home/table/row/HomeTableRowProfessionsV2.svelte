<script lang="ts">
    import { getCharacterTableContext } from '@/components/character-table/context';
    import { Constants } from '@/data/constants';
    import { expansionProfessionConcentration } from '@/data/professions/cooldowns';
    import { professionMoxie } from '@/data/professions/moxie';
    import type { CharacterProps } from '@/types/props';

    import Profession from './HomeTableRowProfessionsV2Profession.svelte';

    let { character }: CharacterProps = $props();

    const { characters: visibleCharacters } = getCharacterTableContext()();
    let [anyConcentration, anyMoxie] = $derived.by(() => {
        const professionIds = visibleCharacters.map((char) =>
            char.professionData.map(([prof, , isCurrent]) => [prof.id, isCurrent])
        ) as [number, boolean][][];

        const retConcentration = [
            professionIds.some((data) => data[0]?.[1] && !!concentrationData[data[0][0]]),
            professionIds.some((data) => data[1]?.[1] && !!concentrationData[data[1][0]]),
        ];
        const retMoxie = [
            professionIds.some((data) => data[0]?.[1] && !!professionMoxie[data[0][0]]),
            professionIds.some((data) => data[1]?.[1] && !!professionMoxie[data[1][0]]),
        ];

        return [retConcentration, retMoxie];
    });

    let concentrationData = $derived(expansionProfessionConcentration[Constants.expansion]);
    let professions = $derived(character.professionData);

    // TODO: derive from settings state
    let fields = $derived(['concentration', 'moxie']);

    let columnCounts = $derived([
        1 +
            (fields.includes('concentration') && anyConcentration[0] ? 1 : 0) +
            (fields.includes('moxie') && anyMoxie[0] ? 1 : 0),
        1 +
            (fields.includes('concentration') && anyConcentration[1] ? 1 : 0) +
            (fields.includes('moxie') && anyMoxie[1] ? 1 : 0),
    ]);
</script>

<style lang="scss">
    td {
        --profession-width: 3.5rem;

        padding-left: 0;
        padding-right: 0;
    }
    .flex-wrapper {
        flex-wrap: nowrap;
        gap: 0.3rem;
        width: 100%;
    }
    .professions {
        display: grid;
        width: 100%;

        :global(> :not(:first-child)) {
            border-left: 1px solid var(--border-color);
        }
    }
</style>

<td class="b-l">
    <div class="professions" style:grid-template-columns="{columnCounts[0]}fr {columnCounts[1]}fr">
        {#each professions as [profession, charProfession, current], index (profession.id)}
            <Profession
                columns={columnCounts[index]}
                showConcentration={anyConcentration[index]}
                showMoxie={anyMoxie[index]}
                {character}
                {charProfession}
                {fields}
                {profession}
                {current}
            />
        {/each}
    </div>
</td>
