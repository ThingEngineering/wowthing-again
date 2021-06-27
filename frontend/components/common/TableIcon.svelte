<script lang="ts">
    export let padLeft = '0.5rem'
    export let padRight = '0px'
</script>

<style lang="scss">
    td {
        min-width: calc(#{$width-icon} + var(--pad-left) + var(--pad-right));
        width: calc(#{$width-icon} + var(--pad-left) + var(--pad-right));
        padding-left: var(--pad-left);
        padding-right: var(--pad-right);
        text-align: center;
    }
</style>

<td style="--pad-left: {padLeft}; --pad-right: {padRight};">
    <slot />
</td>
