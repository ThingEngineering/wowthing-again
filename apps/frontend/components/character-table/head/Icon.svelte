<script lang="ts">
    let { padLeft = '0.1rem', padRight = '0px' }: { padLeft?: string; padRight?: string } =
        $props();
</script>

<style lang="scss">
    th {
        @include cell-width(
            $width-icon,
            var(--pad-left, $width-padding),
            var(--pad-right, $width-padding)
        );
    }
</style>

<th style="--pad-left:{padLeft};--pad-right:{padRight};">&nbsp;</th>
