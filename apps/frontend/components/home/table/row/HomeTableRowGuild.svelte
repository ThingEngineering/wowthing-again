<script lang="ts">
    import { userStore } from '@/stores';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { Character } from '@/types';

    let { character }: { character: Character } = $props();

    let guild = $derived($userStore.guildMap[character.guildId]);
    let guildName = $derived(guild?.name || 'Unknown Guild');
</script>

<style lang="scss">
    td {
        @include cell-width($width-guild, $maxWidth: $width-guild-max);

        border-left: 1px solid $border-color;
    }
</style>

<td
    class="text-overflow"
    use:basicTooltip={guild ? `${guildName} - ${guild?.realm?.name || 'Unknown Realm'}` : null}
>
    {#if character.guildId}
        {guildName}
    {/if}
</td>
