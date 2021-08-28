<script lang="ts">
    import type {TransmogDataCategory} from '@/types/data'

    import TransmogTableGroup from './TransmogTableGroup.svelte'

    export let category: TransmogDataCategory

    console.log('category', category)
</script>

<style lang="scss">
    .name {
        border-right: 1px solid $border-color;
        padding: 0.25rem 0.5rem 0 0.5rem;
    }
</style>

<tr>
    <td class="name" colspan="13">{category.name}</td>
</tr>
{#each category.groups as group}
    <TransmogTableGroup {group} />
{/each}
