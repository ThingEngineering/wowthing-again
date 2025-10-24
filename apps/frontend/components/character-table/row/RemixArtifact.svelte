<script lang="ts">
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        --max-width: 4rem;
        --width: 2rem;
    }
</style>

{#if character.isRemix}
    <td class="c border-left" data-tooltip={`Limits Unbound ${character.remixArtifactRank} / 999`}>
        {character.remixArtifactRank}
    </td>
{:else}
    <td class="c border-left">--</td>
{/if}
