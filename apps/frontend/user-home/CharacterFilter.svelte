<script lang="ts">
    import { router } from 'svelte-spa-router';

    import { iconLibrary } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { newNavState } from '@/stores/local-storage';

    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';
    import Tooltip from '@/components/tooltips/character-filter/TooltipCharacterFilter.svelte';

    const clearFilter = () => ($newNavState.characterFilter = '');
</script>

<style lang="scss">
    .character-filter {
        align-items: center;
        display: flex;

        :global(svg) {
            color: var(--color-fail);
        }
    }
    .clear-filter {
        cursor: pointer;
    }
</style>

<div class="character-filter" id="character-filter">
    <TextInput
        name="character-filter"
        placeholder={(router.location === '/' ? settingsState.activeView.characterFilter : '') ||
            'Character filter...'}
        bind:value={$newNavState.characterFilter}
        tooltipComponent={{
            component: Tooltip,
            props: {},
        }}
    />

    <button class="clear-filter" on:click={clearFilter}>
        <IconifyWrapper icon={iconLibrary.mdiClose} tooltip="Clear filter" />
    </button>
</div>
