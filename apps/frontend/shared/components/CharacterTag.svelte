<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { Character } from '@/types';

    let { character }: { character: Character } = $props();
</script>

{settingsState.value.accounts?.[character.accountId]?.tag || ''}
