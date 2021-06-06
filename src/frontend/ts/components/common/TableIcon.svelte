<script lang="ts">
</script>

<style lang="scss">
    @import 'scss/variables';

    td {
        min-width: $character-width-icon;
        width: $character-width-icon;
        text-align: center;

        & :global(img) {
            border-radius: $border-radius;
            margin-top: -4px;
        }
    }
</style>

<td>
    <slot></slot>
</td>
