<script lang="ts">
    import find from 'lodash/find';
    import type { Component } from 'svelte';
    import { replace } from 'svelte-spa-router';
    import active from 'svelte-spa-router/active';

    import { Gender } from '@/enums/gender';
    import { Region } from '@/enums/region';
    import { userState } from '@/user-home/state/user';
    import { charactersState } from '@/stores/local-storage';
    import { splitOnce } from '@/utils/split-once';
    import type { Character, MultiSlugParams } from '@/types';

    import Items from './items/CharactersItems.svelte';
    import Paperdoll from './paperdoll/CharactersPaperdoll.svelte';
    import Professions from './professions/CharacterProfessions.svelte';
    import Shadowlands from './shadowlands/CharactersShadowlands.svelte';
    import Specializations from './specializations/CharactersSpecializations.svelte';

    let { params }: { params: MultiSlugParams } = $props();

    let baseUrl = $derived(`/characters/${params.slug1}/${params.slug2}`);

    let character = $derived.by(() => {
        if (params.slug1 && params.slug2) {
            const [region, realm] = splitOnce(params.slug1, '-');

            return find(
                userState.general.characters,
                (char: Character) =>
                    Region[char.realm.region].toLowerCase() === region &&
                    char.realm.slug === realm &&
                    char.name === params.slug2
            );
        } else {
            return null;
        }
    });

    $effect(() => {
        if (!componentMap[params.slug3]) {
            const stored = $charactersState.lastTab;

            replace(`${baseUrl}/${stored || 'paperdoll'}`);
        } else {
            $charactersState.lastTab = params.slug3;
        }
    });

    const componentMap: Record<string, Component<any, any, any>> = {
        items: Items,
        paperdoll: Paperdoll,
        professions: Professions,
        shadowlands: Shadowlands,
        specializations: Specializations,
    };
</script>

<style lang="scss">
    .thing-container {
        min-width: 1100px;
        padding-bottom: 1rem;
        position: relative;
        width: 1100px;
    }

    h2 {
        span {
            font-size: 1.1rem;
            margin-left: 0.5rem;
        }
    }
    .guild-name {
        color: #ffff88;
    }
    p {
        margin: 0.25rem 0 0.5rem 0;
    }
    nav {
        background: $highlight-background;
        border-bottom: 1px solid var(--border-color);
        border-top: 1px solid var(--border-color);
        display: flex;
        padding: 0;

        a {
            border-right: 1px solid var(--border-color);
            display: block;
            padding: 0.5rem 1rem;

            &:global(.active) {
                background: $active-background;
                color: #fff;
            }
        }
    }
    .character-info {
        padding: 0.5rem;

        p {
            margin: 0;
        }
    }
</style>

{#if character}
    <div class="thing-container border">
        <div class="character-info">
            <h2>
                {character.name}

                {#if character.guildId}
                    <span class="guild-name"
                        >&lt;{userState.general.guildById[character.guildId]?.name ||
                            'Unknown Guild'}&gt;</span
                    >
                {/if}

                <span>{Region[character.realm.region]}-{character.realm.name}</span>
            </h2>

            <p>
                Level {character.level}
                {Gender[character.gender]}
                {character.raceName}
                {character.specializationName}
                {character.className}
            </p>
        </div>

        {#key `${params.slug1}--${params.slug2}`}
            <nav>
                <a href="#{baseUrl}/paperdoll" use:active>Paperdoll</a>
                <a href="#{baseUrl}/items" use:active>Items</a>
                <!-- <a
                    href="#{baseUrl}/specializations"
                    use:active
                >Specializations</a> -->
                <a href="#{baseUrl}/professions" use:active={`${baseUrl}/professions/*`}
                    >Professions</a
                >
                <a href="#{baseUrl}/shadowlands" use:active={`${baseUrl}/shadowlands/*`}
                    >Shadowlands</a
                >
            </nav>
        {/key}

        <svelte:component this={componentMap[params.slug3]} {character} {params} />
    </div>
{/if}
