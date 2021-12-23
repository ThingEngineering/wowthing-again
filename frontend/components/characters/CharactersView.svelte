<script lang="ts">
    import find from 'lodash/find'
    import type { SvelteComponent } from 'svelte'

    import { classMap } from '@/data/character-class'
    import { raceMap } from '@/data/character-race'
    import { staticStore, userStore } from '@/stores'
    import { Gender, Region } from '@/types/enums'
    import type { Character } from '@/types'

    import General from './general/CharactersGeneral.svelte'
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

        if (!slug3) {
            //slug3 = 'general'
            slug3 = 'specializations'
        }
    }

    const componentMap: Record<string, typeof SvelteComponent> = {
        general: General,
        specializations: Specializations,
    }
</script>

<style lang="scss">
    .thing-container {
        padding: 1rem;
    }

    h2 {
        span {
            font-size: 1.1rem;
            margin-left: 0.5rem;
        }
    }
    p {
        border-bottom: 1px solid $border-color;
        margin: 0.25rem 0 0.5rem 0;
        padding-bottom: 0.5rem;
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

        <svelte:component
            this={componentMap[slug3]}
            {character}
        />
    </div>
{/if}
