<script lang="ts">
    import find from 'lodash/find'
    import type { SvelteComponent } from 'svelte'
    import active from 'svelte-spa-router/active'

    import { classMap } from '@/data/character-class'
    import { raceMap } from '@/data/character-race'
    import { userStore } from '@/stores'
    import { Gender, Region } from '@/types/enums'
    import type { Character } from '@/types'

    import Paperdoll from './paperdoll/CharactersPaperdoll.svelte'
    import Shadowlands from './shadowlands/CharactersShadowlands.svelte'
    import Specializations from './specializations/CharactersSpecializations.svelte'

    export let slug1: string
    export let slug2: string
    export let slug3: string

    let character: Character
    $: {
        character = find(
            $userStore.data.characters,
            (char: Character) => (
                char.realm.slug === slug1 &&
                char.name === slug2
            )
        )

        if (!componentMap[slug3]) {
            slug3 = 'paperdoll'
        }
    }

    const componentMap: Record<string, SvelteComponent> = {
        paperdoll: Paperdoll,
        shadowlands: Shadowlands,
        specializations: Specializations,
    }
</script>

<style lang="scss">
    .thing-container {
        padding: 1rem;
        width: 60rem;
    }

    h2 {
        span {
            font-size: 1.1rem;
            margin-left: 0.5rem;
        }
    }
    p {
        margin: 0.25rem 0 0.5rem 0;
    }
    nav {
        background: $highlight-background;
        border-radius: 0;
        display: flex;
        margin-bottom: 1rem;
        margin-left: calc(-1rem + -1px);
        padding: 0;
        width: calc(100% + 2rem + 2px);

        a {
            border-right: 1px solid $border-color;
            display: block;
            padding: 0.5rem 1rem;

            &:global(.active) {
                background: $active-background;
                color: #fff;
            }
        }
    }
</style>

{#if character}
    <div class="thing-container border">
        <h2>
            {character.name}
            {#if true}
                <span>&lt;Guild Name&gt;</span>
            {/if}
            <span>{Region[character.realm.region]}-{character.realm.name}</span>
        </h2>

        <p>Level {character.level} {Gender[character.gender]} {raceMap[character.raceId].name} {classMap[character.classId].name}</p>

        <nav class="border">
            <a href="#/characters/{slug1}/{slug2}/paperdoll" use:active>Paperdoll</a>
            <a href="#/characters/{slug1}/{slug2}/specializations" use:active>Specializations</a>
            <a href="#/characters/{slug1}/{slug2}/shadowlands" use:active>Shadowlands</a>
        </nav>

        <svelte:component
            this={componentMap[slug3]}
            {character}
        />
    </div>
{/if}
