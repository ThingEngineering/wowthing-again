<script lang="ts">
</script>

<style lang="scss">
    @import 'scss/variables';

    td {
        text-align: center;
        width: $character-width-icon;

        & :global(img) {
            border-radius: $border-radius;
            margin-top: -5px;
        }
    }
</style>

<td>
    <slot></slot>
</td>
