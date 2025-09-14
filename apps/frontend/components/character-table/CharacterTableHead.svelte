<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    let commonFields = $derived(settingsState.value.views[0].commonFields);
    let colspan = $derived(
        commonFields.length +
            (commonFields.indexOf('accountTag') >= 0 ? (settingsState.useAccountTags ? 0 : -1) : 0)
    );
</script>

<style lang="scss">
    .head-text {
        --image-margin-top: -4px;

        padding-left: calc(var(--padding-width) * var(--padding, 1));
        text-align: left;
    }
</style>

<thead>
    <slot name="headTop" {colspan}></slot>
    <tr>
        <th class="head-text" {colspan}>
            <slot name="headText" />
        </th>

        <slot />
    </tr>
</thead>
