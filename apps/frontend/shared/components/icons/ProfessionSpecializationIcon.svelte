<script lang="ts">
    import { professionSpecializationSpells } from '@/data/professions';
    import type { CharacterProps } from '@/types/props';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';

    type Props = CharacterProps & {
        professionId: number;
        includeText?: boolean;
    };
    let { character, professionId, includeText }: Props = $props();
    let specId = $derived(character.professionSpecializations?.[professionId]);
</script>

{#if specId}
    <WowheadLink id={specId} type="spell">
        <WowthingImage name="spell/{specId}" size={20} border={1} />
        {#if includeText}
            {professionSpecializationSpells[specId]}
        {/if}
    </WowheadLink>
{/if}
