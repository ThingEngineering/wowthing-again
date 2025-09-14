<script lang="ts">
    let { vaultType }: { vaultType: string } = $props();
</script>

<style lang="scss">
    th {
        --width: var(--width-vault);

        vertical-align: bottom;
    }
</style>

<th>{vaultType} Vault</th>
