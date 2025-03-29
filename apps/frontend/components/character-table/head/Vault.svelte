<script lang="ts">
    export let vaultType: string;
</script>

<style lang="scss">
    th {
        @include cell-width($width-vault);

        vertical-align: bottom;
    }
</style>

<th>{vaultType} Vault</th>
