<script lang="ts">
    import { basicTooltip } from '@/shared/utils/tooltips';
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
        @include cell-width($width-guild, $maxWidth: $width-guild-max);

        border-left: 1px solid $border-color;
    }
</style>

<td class="text-overflow" use:basicTooltip={character.guildId ? guildName : null}>
    {#if character.guildId}
        {guildName}
    {:else}
        ---
    {/if}
</td>
