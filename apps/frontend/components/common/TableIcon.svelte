<script lang="ts">
    export let padLeft = 'unset';
    export let padRight = 'unset';

    $: {
        padLeft = padLeft ?? 'unset';
        padRight = padRight ?? 'unset';
    }
</script>

<style lang="scss">
    td {
        --width: var(--width-icon);

        text-align: center;
    }
</style>

<td style="--padding-left:{padLeft};--padding-right:{padRight};">
    <slot />
</td>
