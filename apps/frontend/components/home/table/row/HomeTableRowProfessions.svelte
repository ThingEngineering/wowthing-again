<script lang="ts">
    import { Constants } from '@/data/constants';
    import { imageStrings } from '@/data/icons';
    import { professionIdToSlug } from '@/data/professions';
    import { Region } from '@/enums/region';
    import { wowthingData } from '@/shared/stores/data';
    import { getProfessionSortKey } from '@/utils/professions';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { Character, CharacterProfession } from '@/types';
    import type { StaticDataProfession } from '@/shared/stores/static/types';

    import Tooltip from '@/components/tooltips/professions/TooltipProfessions.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let character: Character;
    export let professionType = 0;

    let professions: [StaticDataProfession, CharacterProfession, boolean][];
    $: {
        professions = [];
        for (const [professionId, profession] of wowthingData.static.professionById.entries()) {
            if (professionId === 794 && !settingsState.value.layout.includeArchaeology) {
                continue;
            }

            if (profession?.type === professionType) {
                if (profession.subProfessions.length > 0) {
                    let best: [CharacterProfession, number];
                    for (const expansion of settingsState.expansions) {
                        const subProfession = profession.expansionSubProfession[expansion.id];
                        if (subProfession) {
                            const characterSubProfession =
                                character.professions?.[profession.id]?.[subProfession.id];
                            if (characterSubProfession && expansion.id >= (best?.[1] || 0)) {
                                best = [characterSubProfession, expansion.id];
                            }
                        }
                    }

                    if (best) {
                        professions.push([profession, best[0], best[1] === Constants.expansion]);
                    } else if (professionType === 1) {
                        professions.push([profession, null, true]);
                    }
                } else {
                    const characterProfession =
                        character.professions?.[profession.id]?.[profession.id];
                    professions.push([profession, characterProfession || null, true]);
                }
            }
        }
        professions.sort((a, b) =>
            getProfessionSortKey(a[0]).localeCompare(getProfessionSortKey(b[0]))
        );
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-professions);

        border-left: 1px solid $border-color;

        &.triple {
            @include cell-width($width-professions-triple);
        }
    }
    .flex-wrapper {
        width: 100%;
    }
    a {
        align-items: center;
        color: $body-text;
        display: flex;
        justify-content: space-between;

        span {
            display: block;
            text-align: right;
            width: 2.1rem;
        }

        &:hover {
            text-decoration: underline;
        }
    }
</style>

<td class:triple={professions.length === 3}>
    {#if professions.length > 0}
        <div class="flex-wrapper">
            {#each professions as [profession, charProfession, current]}
                {@const currentSkill = charProfession?.currentSkill || 0}
                <div
                    class="profession"
                    data-id={profession.id}
                    use:componentTooltip={{
                        component: Tooltip,
                        props: {
                            character,
                            profession,
                        },
                    }}
                >
                    <a
                        href="#/characters/{Region[character.realm.region].toLowerCase()}-{character
                            .realm.slug}/{character.name}/professions/{profession.slug}"
                    >
                        <WowthingImage
                            name={imageStrings[professionIdToSlug[profession.id]]}
                            size={20}
                            border={1}
                        />
                        <span
                            class:status-fail={!current || currentSkill === 0}
                            class:status-success={current &&
                                currentSkill > 0 &&
                                currentSkill >= charProfession.maxSkill}
                        >
                            {currentSkill || '---'}
                        </span>
                    </a>
                </div>
            {/each}
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
