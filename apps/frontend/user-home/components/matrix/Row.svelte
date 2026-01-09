<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { Constants } from '@/data/constants';
    import { Region } from '@/enums/region';
    import { browserState } from '@/shared/state/browser.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { Character } from '@/types';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import TooltipCharacter from './TooltipCharacter.svelte';

    type Props = {
        count: number;
        xKeys: string[];
        yEntries: string[];
        yKey: string;
        getCharacters: (xKey: string, yKey: string) => Character[];
    };
    let { count, xKeys, yEntries, yKey, getCharacters }: Props = $props();

    let element: HTMLElement = $state(null);
    let intersected = $state(false);
</script>

<style lang="scss">
    tr {
        height: 1.7rem;
    }
    .y-axis {
        --max-width: 10rem;
        --width: 4rem;
    }
    .characters {
        white-space: nowrap;
        &.as-level {
            --width: 2.5rem;
        }
        &.as-name {
            --width: 6rem;
        }
    }
    .character {
        --image-margin-top: -4px;
    }
    .counts {
        color: #44ffff;
    }
</style>

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <tr bind:this={element}>
        {#if intersected}
            <td class="y-axis max-width text-overflow">
                {#each yEntries as line}
                    <ParsedText text={line} />
                    <!-- {line} -->
                {/each}
            </td>
            {#each xKeys as xKey (xKey)}
                {@const keyCharacters = getCharacters(xKey, yKey)}
                <td
                    class="characters as-{browserState.current.matrix.showCharacterAs}"
                    class:bg-success={keyCharacters.some(
                        (char) => char.level === Constants.characterMaxLevel
                    )}
                    class:bg-fail={keyCharacters.length === 0}
                >
                    {#each keyCharacters as character (character.id)}
                        <div
                            class="character"
                            use:componentTooltip={{
                                component: TooltipCharacter,
                                props: {
                                    character,
                                },
                            }}
                        >
                            {#if browserState.current.matrix.showCharacterAs === 'level'}
                                {character.level}
                            {:else}
                                <a
                                    class="class-{character.classId} drop-shadow"
                                    href="#/characters/{Region[
                                        character.realm.region
                                    ].toLocaleLowerCase()}-{character.realm.slug}/{character.name}"
                                >
                                    {character.name}
                                </a>
                            {/if}
                        </div>
                    {:else}
                        ---
                    {/each}
                </td>
            {/each}
            <td class="counts">{count}</td>
        {/if}
    </tr>
</IntersectionObserver>
