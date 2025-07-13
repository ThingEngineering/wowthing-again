<script lang="ts">
    import { iconLibrary } from '@/shared/icons';
    import { basicTooltip } from '@/shared/utils/tooltips/basic-tooltip';
    import { homeState } from '@/stores/local-storage';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    let { sortKey }: { sortKey: string } = $props();

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey];
        $homeState.groupSort[sortKey] = current === column ? undefined : column;
    }

    const sortField = 'statsSpeed';
</script>

<style lang="scss">
</style>

<td
    class="sortable"
    class:sorted-by={$homeState.groupSort[sortKey] === sortField}
    onclick={() => setSorting(sortField)}
    onkeypress={() => setSorting(sortField)}
    use:basicTooltip={'Movement Speed'}
>
    <IconifyIcon icon={iconLibrary.mdiRunFast} scale="0.9" />
</td>
