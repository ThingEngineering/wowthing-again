<script lang="ts">
    import { staticStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
</script>

<style lang="scss">
    td {
        @include cell-width(2.0rem);
    }
</style>

{#each $settings.layout.homeLockouts as instanceId}
    <td>{$staticStore.data.instances[instanceId].shortName}</td>
{/each}
