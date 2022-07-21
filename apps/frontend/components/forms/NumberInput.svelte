<script lang="ts">
    export let label: string = null
    export let name: string
    export let value: number
    export let minValue: number
    export let maxValue: number
</script>

<style lang="scss">
    input {
        border: 1px solid $border-color;
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
    <input id="input-{name}" name={name} type="number" min="{minValue}" max="{maxValue}" bind:value={value} on:input>
    <slot />
</fieldset>
