<script lang="ts">
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { appearanceSetPrefix, progressAchievements, unlockText } from './data';
    import type { Character } from '@/types';

    type Props = {
        artifactItemId: number;
        classId: number;
        specializationId: number;
    };
    let { artifactItemId, classId, specializationId }: Props = $props();

    let artifact = $derived(wowthingData.static.artifactBySpecializationId.get(specializationId));
    let item = $derived(wowthingData.items.items[artifactItemId]);
    $inspect({ artifact, item });

    function unlockProgress(
        setIndex: number,
        appearanceIndex: number
    ): [number, number, string, Character] {
        const [achievementId, need, text, criteriaIndex] =
            progressAchievements[`${setIndex}-${appearanceIndex}`];

        const classCharacters = userState.general.activeCharacters.filter(
            (char) => char.classId === classId
        );

        let bestCharacter: Character;
        let bestHave = 0;
        for (const character of classCharacters) {
            let characterHave = 0;
            const cheev = userState.achievements.addonAchievements?.[character.id]?.[achievementId];
            if (cheev) {
                if (criteriaIndex !== undefined) {
                    characterHave = cheev.criteria[criteriaIndex];
                } else {
                    characterHave = (cheev.criteria || []).reduce((a, b) => a + b, 0);
                }
            }

            if (characterHave > bestHave) {
                bestCharacter = character;
                bestHave = characterHave;
            }
        }

        return [need, bestHave, text, bestCharacter];
    }
</script>

<style lang="scss">
    .spec-data {
        --image-border-width: 2px;
        --image-margin-top: -4px;

        width: 25rem;
    }
    .title {
        font-size: 1.1rem;
        padding: var(--padding-size);
    }
    .appearance-set {
        --width: 7rem;
        max-width: 8rem;
    }
    .appearance {
        border-left: 1px solid var(--border-color);
        padding: 0.3rem 0;
        text-align: center;
        width: 2.5rem;
    }
    .unfaded {
        opacity: 1;
    }
</style>

<div class="spec-data wrapper-column">
    {#if artifact}
        <table class="table table-striped">
            <thead>
                <tr>
                    <td class="title class-{classId}" colspan="100">
                        <SpecializationIcon specId={specializationId} border={2} />
                        <span class="drop-shadow">{artifact.name}</span>
                    </td>
                </tr>
            </thead>
            <tbody>
                {#each artifact.appearanceSets as appearanceSet, setIndex}
                    {@const faded =
                        setIndex >= 4 &&
                        !userState.general.hasAppearanceBySource.has(
                            artifactItemId * 1000 + appearanceSet.appearances[0].appearanceModifier
                        )}
                    <tr>
                        <td class="appearance-set text-overflow" class:faded>
                            <ParsedText
                                text={`[${appearanceSetPrefix[setIndex]}] ${appearanceSet.name}`}
                            />
                        </td>
                        {#each appearanceSet.appearances as appearance, appearanceIndex}
                            {@const sourceId =
                                (artifactItemId || 0) * 1000 + appearance.appearanceModifier}
                            {@const userHas = userState.general.hasAppearanceBySource.has(sourceId)}
                            <td
                                class="appearance"
                                class:status-success={userHas}
                                class:status-warn={!userHas}
                                class:faded={faded && !userHas}
                                style:background={`#${appearance.swatchColor.substring(0, 6)}${userHas ? '7F' : '3F'}`}
                            >
                                {#if setIndex >= 4 && appearanceIndex > 0 && !userHas && !faded}
                                    {@const [need, have, text, character] = unlockProgress(
                                        setIndex,
                                        appearanceIndex
                                    )}
                                    <div
                                        class="quality1 drop-shadow"
                                        data-tooltip="{character
                                            ? `${character.name}-${character.realm.name}: `
                                            : ''} {have} / {need} {text}"
                                    >
                                        {((have / need) * 100).toFixed(0)}%
                                    </div>
                                {:else}
                                    <div
                                        data-tooltip={userHas
                                            ? undefined
                                            : unlockText[`${setIndex}-${appearanceIndex}`]}
                                    >
                                        <YesNoIcon extraClass="drop-shadow" state={userHas} />
                                    </div>
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>
