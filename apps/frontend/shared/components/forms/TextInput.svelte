<script lang="ts" generics="TComponent extends SvelteComponent">
    import type { SvelteComponent } from 'svelte'

    import { iconLibrary } from '@/shared/icons'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { ComponentTooltipProps } from '@/shared/utils/tooltips/types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'

    export let clearButton = false
    export let inputWidth: string = null
    export let label = ''
    export let maxlength: number = null
    export let name: string
    export let placeholder = ''
    export let tooltipComponent: ComponentTooltipProps<TComponent> = undefined
    export let value: string
</script>

<style lang="scss">
    fieldset {
        display: flex;
        gap: 0.2rem;
        align-items: center;
    }
    input {
        border-radius: $border-radius;
        width: 100%;
    }
    label {
        display: block;
    }
    .clear-text {
        cursor: pointer;
    }
    .disabled {
        cursor: default;
        opacity: 0.5;
    }
</style>

<fieldset>
    {#if label}
        <label for="input-{name}">{label}</label>
    {/if}

    <input
        id="input-{name}"
        class="border"
        name={name}
        placeholder={placeholder}
        {maxlength}
        bind:value={value}
        use:componentTooltip={tooltipComponent}
        style:width={inputWidth}
    >

    {#if clearButton}
        <button
            class="clear-text"
            class:disabled={!value}
            on:click={() => value = ''}
        >
            <IconifyIcon
                icon={iconLibrary.mdiClose}
                tooltip="Clear text"
            />
        </button>
    {/if}

    <slot />
</fieldset>
