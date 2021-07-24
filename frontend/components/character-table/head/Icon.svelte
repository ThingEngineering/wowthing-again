<script lang="ts">
    export let padLeft: string
    export let padRight: string

    $: {
        padLeft = padLeft ?? 'unset'
        padRight = padRight ?? 'unset'
    }
</script>

<style lang="scss">
    th {
        @include cell-width($width-icon, var(--pad-left, $width-padding), var(--pad-right, $width-padding));
    }
</style>

<th style="--pad-left:{padLeft};--pad-right:{padRight};">&nbsp;</th>
