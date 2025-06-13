<script lang="ts">
    import { tick } from 'svelte';
    import { replace } from 'svelte-spa-router';

    import { wowthingData } from '@/shared/stores/data';
    import type { MultiSlugParams } from '@/types';
    import type { CharacterProps } from '@/types/props';

    import Collectibles from './CharacterProfessionsCollectibles.svelte';
    import Equipment from '@/components/professions/Equipment.svelte';
    import Profession from './CharacterProfessionsProfession.svelte';
    import Sidebar from './CharacterProfessionsSidebar.svelte';
    import Traits from './CharacterProfessionsTraits.svelte';

    let { character, params }: CharacterProps & { params: MultiSlugParams } = $props();

    let staticProfession = $derived(wowthingData.static.professionBySlug.get(params.slug4));
    let charProfession = $derived(character.professions[staticProfession?.id]);

    $effect.pre(() => {
        if (!staticProfession || !charProfession) {
            // Profession doesn't exist or character doesn't have it, redirect to the first one
            setTimeout(async () => {
                await tick();
                const link = document
                    .getElementById('character-professions-subnav')
                    .querySelector('a:first-child');
                if (link) {
                    replace(link.getAttribute('href').replace('#', ''));
                }
            }, 1);
        }
    });
</script>

<style lang="scss">
    .professions {
        align-items: flex-start;
        display: flex;
        padding-bottom: 1rem;
        padding-right: 1rem;
    }
    .sidebar-after {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem 0;
    }
</style>

<div class="professions">
    <div class="professions-sidebar">
        <Sidebar {character} {params} {staticProfession}>
            <svelt:fragment slot="after">
                {#if staticProfession}
                    <div class="sidebar-after">
                        <Equipment profession={staticProfession} {character} />

                        {#if params.slug5}
                            <Collectibles
                                expansionSlug={params.slug5}
                                {staticProfession}
                                {character}
                            />
                        {/if}
                    </div>
                {/if}
            </svelt:fragment>
        </Sidebar>
    </div>

    {#if staticProfession}
        {#if params.slug6 === 'traits'}
            <Traits {character} {params} {staticProfession} />
        {:else if params.slug5}
            <Profession {character} {params} {staticProfession} />
        {/if}
    {/if}
</div>
