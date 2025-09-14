<script lang="ts">
    import { dragonflightKnowledge, dragonflightProfessions } from '@/data/professions';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { Character } from '@/types';

    import CharacterKnowledge from './CharacterKnowledge.svelte';
    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import Row from './DragonflightRow.svelte';
    import RowProfessions from '@/components/home/table/row/HomeTableRowProfessions.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    const filterFunc = (char: Character) =>
        dragonflightProfessions.some((p) => char.professions?.[p.id]);
</script>

<style lang="scss">
    .zone {
        --image-border-radius: var(--border-radius);
        --image-border-width: 2px;
        --width: var(--width-mplus-dungeon);

        background: var(--color-thing-background);
        border: 1px solid var(--border-color);
        padding-bottom: 0.3rem;
        padding-top: 0.3rem;
        position: relative;

        span {
            bottom: calc(0.3rem + 1px);
        }
    }
</style>

<CharacterTable {filterFunc}>
    <CharacterTableHead slot="head">
        <th></th>
        <th class="spacer"></th>
        <th colspan="2" class="border"></th>
        <th class="spacer"></th>
        {#each dragonflightKnowledge as dk}
            {#if dk === null}
                <th class="spacer"></th>
            {:else}
                <th class="zone" use:basicTooltip={dk.name}>
                    <WowthingImage name={dk.icon} size={48} />
                    <span class="pill abs-center">{dk.shortName}</span>
                </th>
            {/if}
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        <RowProfessions {character} />
        <td class="spacer"></td>
        <CharacterKnowledge {character} expansionSlug="dragonflight" profession={0} />
        <CharacterKnowledge {character} expansionSlug="dragonflight" profession={1} />
        <Row {character} />
    </svelte:fragment>
</CharacterTable>
