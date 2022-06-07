<script lang="ts">
    import find from 'lodash/find'
    import type { SvelteComponent } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { classMap } from '@/data/character-class'
    import { raceMap } from '@/data/character-race'
    import { userStore } from '@/stores'
    import { charactersState } from '@/stores/local-storage'
    import { Gender, Region } from '@/types/enums'
    import type { Character, MultiSlugParams } from '@/types'

    import Paperdoll from './paperdoll/CharactersPaperdoll.svelte'
    import Shadowlands from './shadowlands/CharactersShadowlands.svelte'
    import Specializations from './specializations/CharactersSpecializations.svelte'

    export let params: MultiSlugParams

    let baseUrl: string
    let character: Character
    $: {
        baseUrl = `/characters/${params.slug1}/${params.slug2}`

        if (params.slug1 && params.slug2) {
            const [region, realm] = params.slug1.split('-')

            character = find(
                $userStore.data.characters,
                (char: Character) => (
                    Region[char.realm.region].toLowerCase() === region &&
                    char.realm.slug === realm &&
                    char.name === params.slug2
                )
            )

            if (!componentMap[params.slug3]) {
                const stored = $charactersState.lastTab

                replace(`${baseUrl}/${stored || 'paperdoll'}`)
            }
            else {
                $charactersState.lastTab = params.slug3
            }
        }
    }

    const componentMap: Record<string, typeof SvelteComponent> = {
        paperdoll: Paperdoll,
        shadowlands: Shadowlands,
        specializations: Specializations,
    }
</script>

<style lang="scss">
    .thing-container {
        min-width: 1100px;
        padding: 1rem;
        width: 1100px;
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

        {#key `${params.slug1}--${params.slug2}`}
            <nav class="border">
                <a href="#{baseUrl}/paperdoll" use:active>Paperdoll</a>
                <a href="#{baseUrl}/specializations" use:active>Specializations</a>
                <a
                    href="#{baseUrl}/shadowlands"
                    use:active={`${baseUrl}/shadowlands/*`}
                >Shadowlands</a>
            </nav>
        {/key}

        <svelte:component
            this={componentMap[params.slug3]}
            {character}
            {params}
        />
    </div>
{/if}
