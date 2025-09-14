<script lang="ts">
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        --max-width: var(--width-location-max);
        --width: var(--width-location);

        border-left: 1px solid var(--border-color);
    }
    .status-fail {
        text-align: center;
    }
</style>

<td class="max-width" class:status-fail={!character.hearthLocation}>
    {character.hearthLocation || '---'}
</td>
