<script lang="ts">
    import { userStore } from '@/stores'
    import { settingsStore } from '@/user-home/stores/settings'

    let colspan: number
    $: {
        colspan = $settingsStore.layout.commonFields.length +
            ($settingsStore.layout.commonFields.indexOf('accountTag') >= 0
                ? (userStore.useAccountTags ? 0 : -1)
                : 0
            )
    }
</script>

<style lang="scss">
    .head-text {
        --image-margin-top: -4px;

        padding-left: calc($width-padding * var(--padding, 1));
        text-align: left;
    }
</style>

<thead>
    <tr>
        <th class="head-text" colspan="{colspan}">
            <slot name="headText" />
        </th>

        <slot />
    </tr>
</thead>
