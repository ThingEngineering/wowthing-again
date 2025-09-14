<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        --max-width: 5rem;
        --width: 1rem;

        border-right: 1px solid var(--border-color);
        text-align: right;
    }
</style>

{#if settingsState.useAccountTags}
    <td class="alt max-width nowrap">
        {#if character}
            {settingsState.value.accounts?.[character.accountId]?.tag}
        {/if}
    </td>
{/if}
