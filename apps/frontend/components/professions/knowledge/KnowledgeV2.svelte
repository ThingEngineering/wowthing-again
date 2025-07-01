<script lang="ts">
    import { warWithinProfessions } from '@/data/professions';
    import { warWithinZones } from '@/data/zones';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { Character } from '@/types';

    import CharacterKnowledge from './CharacterKnowledge.svelte';
    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import RowProfessions from '@/components/home/table/row/HomeTableRowProfessions.svelte';
    import V2Row from './V2Row.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { slug }: { slug: string } = $props();

    // TODO: update this for more generic expansion stuff
    const filterFunc = (char: Character) =>
        warWithinProfessions.some((p) => char.professions?.[p.id]);
</script>

<style lang="scss">
    .zone {
        @include cell-width($width-mplus-dungeon);

        --image-border-radius: var(--border-radius);
        --image-border-width: 2px;

        background: $thing-background;
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
        {#each warWithinZones as zone}
            {#if zone === null}
                <th class="spacer"></th>
            {:else}
                <th class="zone" use:basicTooltip={zone.name}>
                    <WowthingImage name={zone.icon} size={48} />
                    <span class="pill abs-center">{zone.shortName}</span>
                </th>
            {/if}
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        <RowProfessions {character} />
        <td class="spacer"></td>
        <CharacterKnowledge {character} expansionSlug={slug} profession={0} />
        <CharacterKnowledge {character} expansionSlug={slug} profession={1} />
        <V2Row {character} />
    </svelte:fragment>
</CharacterTable>
