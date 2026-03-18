<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { iconLibrary } from '@/shared/icons';

    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';

    const icons = sortBy(Object.entries(iconLibrary), ([name]) => name);
</script>

<style lang="scss">
    .thing-container {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }
    .icon {
        --image-margin-top: -4px;

        padding: 0.2rem 0.3rem;
        width: 18rem;
    }
</style>

<div class="thing-container border">
    {#each icons as [name, icon] (name)}
        <div class="icon">
            <IconifyWrapper {icon} />
            <span>{name}</span>
        </div>
    {/each}
</div>
