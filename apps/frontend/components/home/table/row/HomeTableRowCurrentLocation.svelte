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
        @include cell-width($width-location, $maxWidth: $width-location-max);

        border-left: 1px solid var(--border-color);
    }
    .status-fail {
        text-align: center;
    }
</style>

<td
    class="text-overflow"
    class:status-fail={!character.currentLocation}
    use:basicTooltip={{ allowHTML: true, content: location }}
>
    {@html location}
</td>
