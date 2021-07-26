<script lang="ts">
    export let padLeft = 'unset'
    export let padRight = 'unset'

    $: {
        padLeft = padLeft ?? 'unset'
        padRight = padRight ?? 'unset'
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-icon, var(--pad-left, $width-padding), var(--pad-right, $width-padding));

        text-align: center;
    }
</style>

<td style="--pad-left:{padLeft};--pad-right:{padRight};">
    <slot />
</td>
