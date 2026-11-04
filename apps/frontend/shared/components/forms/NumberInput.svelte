<script lang="ts">
    import type { ChildrenProp, InputEventProps } from '@/types/props';

    type Props = ChildrenProp &
        InputEventProps & {
            name: string;
            value: number;
            minValue: number;
            maxValue: number;
            disabled?: boolean;
            label?: string;
        };
    let {
        name,
        value = $bindable(),
        minValue,
        maxValue,
        disabled = false,
        label,
        children,
        oninput,
    }: Props = $props();
</script>

<style lang="scss">
    input {
        border: 1px solid var(--border-color);
        margin-top: 0.4rem;
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
        {name}
        type="number"
        min={minValue}
        max={maxValue}
        data-1p-ignore
        class:disabled
        {disabled}
        bind:value
        {oninput}
    />
    {@render children?.()}
</fieldset>
