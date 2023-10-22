<script lang="ts">
    import { iconLibrary } from '@/icons'
    import { newNavState } from '@/stores/local-storage'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import TextInput from '@/shared/components/forms/TextInput.svelte'
    import Tooltip from '@/components/tooltips/character-filter/TooltipCharacterFilter.svelte'

    const clearFilter = () => $newNavState.characterFilter = ''
</script>

<style lang="scss">
    .character-filter {
        align-items: center;
        display: none;

        :global(svg) {
            color: $color-fail;
        }
    }
    .clear-filter {
        cursor: pointer;
    }
</style>

<div class="character-filter" id="character-filter">
    <TextInput
        name="character-filter"
        placeholder="Character filter..."
        bind:value={$newNavState.characterFilter}
        tooltipComponent={{
            component: Tooltip,
            props: {},
        }}
    />

    <div
        class="clear-filter"
        on:click={clearFilter}
        on:keypress={clearFilter}
    >
        <IconifyIcon
            icon={iconLibrary.mdiClose}
            tooltip="Clear filter"
        />
    </div>
</div>
