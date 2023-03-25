<script lang="ts">
    import { tippyComponent, type TippyComponentProps } from '@/utils/tippy'

    export let label = ''
    export let maxlength: number = null
    export let name: string
    export let placeholder = ''
    export let tooltipComponent: TippyComponentProps = undefined
    export let value: string
</script>

<style lang="scss">
    input {
        border-radius: $border-radius;
        width: 100%;
    }
    label {
        display: block;
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
        use:tippyComponent={tooltipComponent}
    >

    <slot />
</fieldset>
