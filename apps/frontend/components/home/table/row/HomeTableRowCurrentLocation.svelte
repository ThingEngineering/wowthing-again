<script lang="ts">
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();

    let location = $derived.by(() => {
        let ret = character.currentLocation || '---';
        if (!ret.includes(',')) {
            ret = ret
                .split(' > ')
                .map((loc, index) => `<span class="location${index}">${loc}</span>`)
                .join(' > ');
        }
        return ret;
    });
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

<td
    class="max-width text-overflow"
    class:status-fail={!character.currentLocation}
    use:basicTooltip={{ allowHTML: true, content: location }}
>
    {@html location}
</td>
