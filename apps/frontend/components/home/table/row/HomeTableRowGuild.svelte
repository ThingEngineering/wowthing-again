<script lang="ts">
    import { userStore } from '@/stores'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'

    export let character: Character

    $: guild = $userStore.guildMap[character.guildId]
</script>

<style lang="scss">
    td {
        @include cell-width($width-guild, $maxWidth: $width-guild-max);
        
        border-left: 1px solid $border-color;
    }
</style>

<td
    class="text-overflow"
    use:basicTooltip={guild ? `${guild.name} - ${guild.realm.name}` : null}
>
    {#if character.guildId}
        {#if guild}
            {guild.name}
        {:else}
            --Unknown guild--
        {/if}
    {/if}
</td>
