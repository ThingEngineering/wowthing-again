<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { Snippet } from 'svelte';

    type Props = {
        children?: Snippet;
        headText?: Snippet;
        headTop?: Snippet<[number]>;
    };
    let { children, headText, headTop }: Props = $props();

    let commonFields = $derived(settingsState.value.views[0].commonFields);
    let colspan = $derived(
        commonFields.length +
            (commonFields.indexOf('accountTag') >= 0 ? (settingsState.useAccountTags ? 0 : -1) : 0)
    );
</script>

<style lang="scss">
    .head-text {
        --image-margin-top: -4px;

        text-align: left;
    }
</style>

<thead>
    {@render headTop?.(colspan)}

    <tr>
        <th class="head-text" {colspan}>
            {@render headText?.()}
        </th>

        {@render children?.()}
    </tr>
</thead>
