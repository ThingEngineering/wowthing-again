<script lang="ts">
    import active from 'svelte-spa-router/active';

    import type { Character, MultiSlugParams } from '@/types';
    import type { ProfessionData } from '@/utils/get-character-professions';
    import type { StaticDataProfession } from '@/shared/stores/static/types';

    export let character: Character;
    export let params: MultiSlugParams;
    export let professions: ProfessionData[];

    const getName = function (profession: StaticDataProfession): string {
        const names = profession.name.split('|');
        return names[character.faction] || names[0];
    };
</script>

<style lang="scss">
    a {
        padding: 0.25rem 1rem;

        &:not(.active) {
            background: var(--color-highlight-background);
        }
    }
</style>

{#each professions as [staticProfession, characterProfession]}
    {@const url = `/characters/${params.slug1}/${params.slug2}/${params.slug3}/${staticProfession.slug}`}
    {#if characterProfession != null}
        <a href={`#${url}`} use:active={`${url}/*`}>
            {getName(staticProfession)}
            <!-- <code>{characterProfession.currentSkill} / {characterProfession.maxSkill}</code> -->
        </a>
    {/if}
{/each}
