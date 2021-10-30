<script lang="ts">
    import { staticStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
</script>

{#each $settings.layout.homeLockouts as instanceId}
    <td>{$staticStore.data.instances[instanceId].shortName}</td>
{/each}
