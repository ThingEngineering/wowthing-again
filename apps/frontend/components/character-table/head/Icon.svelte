<script lang="ts">
    let { padLeft = '0.1rem', padRight = '0px' }: { padLeft?: string; padRight?: string } =
        $props();
</script>

<style lang="scss">
    th {
        --width: var(--width-icon);
    }
</style>

<th style="--padding-left:{padLeft};--padding-right:{padRight};">&nbsp;</th>
