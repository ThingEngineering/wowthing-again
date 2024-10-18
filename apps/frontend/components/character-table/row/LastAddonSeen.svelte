<script lang="ts">
    import type { Character } from '@/types';
    import { timeStore } from '@/shared/stores/time';
    import { toNiceDuration } from "@/utils/formatting";

    export let character: Character
</script>

{#if character.lastSeenAddon}
    {@const diff = $timeStore.diff(character.lastSeenAddon).toMillis()}
    <code>{toNiceDuration(diff, false)}</code> ago
{:else}
    ???
{/if}
