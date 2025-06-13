<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion';
    import { imageStrings } from '@/data/icons';
    import { isSecondaryProfession, professionIdToSlug } from '@/data/professions';
    import { wowthingData } from '@/shared/stores/data';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { lazyStore } from '@/stores';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import getPercentClass from '@/utils/get-percent-class';
    import { getProfessionSortKey } from '@/utils/professions';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { Character, CharacterProfession } from '@/types';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        character: Character;
        expansionSlug: string;
        profession: number;
    };
    let { character, expansionSlug, profession }: Props = $props();

    let professions = $derived.by(() => {
        const professions: [StaticDataProfession, CharacterProfession][] = getNumberKeyedEntries(
            character.professions
        )
            .filter(([id]) => !isSecondaryProfession[id])
            .map(([id, charProfession]) => [
                wowthingData.static.professionById.get(id),
                charProfession,
            ]);
        professions.sort((a, b) =>
            getProfessionSortKey(a[0]).localeCompare(getProfessionSortKey(b[0]))
        );
        return professions;
    });
</script>

<style lang="scss">
    td {
        @include cell-width(4.4rem, $paddingLeft: 0.1rem);
    }
    span {
        word-spacing: -0.2ch;
    }
</style>

<td>
    {#if professions[profession]}
        {@const [staticProfession, characterProfession] = professions[profession]}
        {@const staticSubProfession =
            staticProfession.expansionSubProfession[expansionSlugMap[expansionSlug].id]}
        {@const charStats = characterProfession?.subProfessionTraitStats?.[staticSubProfession.id]}
        <div
            class="flex-wrapper"
            use:basicTooltip={`${charStats?.have || 0} / ${charStats?.total || 0} knowledge`}
        >
            <WowthingImage
                name={imageStrings[professionIdToSlug[staticProfession.id]]}
                size={20}
                border={1}
            />
            {#if charStats}
                <span class={getPercentClass(charStats?.percent || 0)}>
                    {Math.floor(charStats?.percent || 0)} %
                </span>
            {:else}
                <span class="status-fail">0 %</span>
            {/if}
        </div>
    {/if}
</td>
