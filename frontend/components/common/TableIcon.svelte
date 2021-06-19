<script lang="ts">
    export let padLeft = '0.5rem'
    export let padRight = '0px'
</script>

<style lang="scss">
    td {
        min-width: calc(#{$character-width-icon} + var(--pad-left) + var(--pad-right));
        width: calc(#{$character-width-icon} + var(--pad-left) + var(--pad-right));
        padding-left: var(--pad-left);
        padding-right: var(--pad-right);
        text-align: center;

        & :global(img) {
            border-radius: $border-radius;
            margin-top: -4px;
        }
    }
</style>

<td style="--pad-left: {padLeft}; --pad-right: {padRight};">
    <slot />
</td>
