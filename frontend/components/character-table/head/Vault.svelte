<script lang="ts">
    export let vaultType: string
</script>

<style lang="scss">
    th {
        min-width: calc(#{$character-width-vault} * 3);
        width: calc(#{$character-width-vault} * 3);
        text-align: center;
        vertical-align: bottom;
    }
</style>

<th colspan="3">{vaultType} Vault</th>
