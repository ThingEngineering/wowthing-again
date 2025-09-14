<script lang="ts">
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();

    let guildName = $derived(
        character.guild
            ? `${character.guild.name} - ${character.guild.realm?.name || 'Unknown Realm'}`
            : 'Unknown Guild - Unknown Realm'
    );
</script>

<style lang="scss">
    td {
        --max-width: 15rem;
        --width: 6rem;

        border-left: 1px solid var(--border-color);
    }
</style>

<td class="max-width text-overflow" data-tooltip={character.guildId ? guildName : null}>
    {#if character.guildId}
        {guildName}
    {:else}
        ---
    {/if}
</td>
