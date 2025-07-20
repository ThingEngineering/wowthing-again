<script lang="ts">
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();

    let speed = $derived(character.movementSpeed);
</script>

<style lang="scss">
    td {
        --width: 2rem;

        word-spacing: -0.2ch;
    }
</style>

<td class="r b-l sized">
    {#if speed.total > 0}
        +{speed.total.toFixed(0)}%
    {/if}
</td>
