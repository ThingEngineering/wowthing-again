<script lang="ts">
    export let padLeft = '0.1rem'
    export let padRight = '0px'

    $: {
        padLeft = padLeft ?? '0.1rem'
        padRight = padRight ?? '0px'
    }
</script>

<style lang="scss">
    th {
        @include cell-width($width-icon, var(--pad-left, $width-padding), var(--pad-right, $width-padding));
    }
</style>

<th style="--pad-left:{padLeft};--pad-right:{padRight};">&nbsp;</th>
