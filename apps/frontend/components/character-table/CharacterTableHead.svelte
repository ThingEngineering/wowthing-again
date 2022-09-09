<script lang="ts">
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'

    let colspan: number
    $: {
        colspan = $settings.layout.commonFields.length +
            ($settings.layout.commonFields.indexOf('accountTag') >= 0
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
    .level {
        @include cell-width($width-level);

        text-align: right;
    }
    .name {
        @include cell-width($width-name, $maxWidth: $width-name-max);
    }
    .realm {
        @include cell-width($width-realm, $maxWidth: $width-realm-max);
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
