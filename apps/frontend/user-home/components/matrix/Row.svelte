<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { Constants } from '@/data/constants';
    import { browserState } from '@/shared/state/browser';
    import { componentTooltip } from '@/shared/utils/tooltips';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import TooltipCharacter from './TooltipCharacter.svelte';
    import { Region } from '@/enums/region';
    import type { Character } from '@/types';

    export let count: number;
    export let xKeys: string[];
    export let yEntries: string[];
    export let yKey: string;
    export let getCharacters: (xKey: string, yKey: string) => Character[];

    let element: HTMLElement;
    let intersected = false;
</script>

<style lang="scss">
    tr {
        height: 1.7rem;
    }
    .y-axis {
        @include cell-width(4rem, $maxWidth: 10rem);
    }
    .characters {
        white-space: nowrap;
        &.as-level {
            @include cell-width(2.5rem);
        }
        &.as-name {
            @include cell-width(6rem);
        }
        &.max-level {
            background: mix($thing-background, $color-success, 90%);
        }
        &.no-characters {
            background: mix($thing-background, $color-fail, 90%);
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
            <td class="y-axis text-overflow">
                {#each yEntries as line}
                    <ParsedText text={line} />
                    <!-- {line} -->
                {/each}
            </td>
            {#each xKeys as xKey}
                {@const keyCharacters = getCharacters(xKey, yKey)}
                <td
                    class="characters as-{browserState.current.matrix.showCharacterAs}"
                    class:max-level={keyCharacters.some(
                        (char) => char.level === Constants.characterMaxLevel
                    )}
                    class:no-characters={keyCharacters.length === 0}
                >
                    {#each keyCharacters as character}
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
