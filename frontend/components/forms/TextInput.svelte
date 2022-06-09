<script lang="ts">
    export let label = ''
    export let maxlength = 0
    export let name: string
    export let placeholder = ''
    export let value: string
</script>

<style lang="scss">
    input {
        border: 1px solid $border-color;
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
        name={name}
        placeholder={placeholder}
        {maxlength}
        bind:value={value}
    >
    <slot />
</fieldset>
