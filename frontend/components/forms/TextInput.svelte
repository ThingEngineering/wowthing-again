<script lang="ts">
    export let label = ''
    export let maxlength = 0
    export let name: string
    export let value: string
</script>

<style lang="scss">
    label {
        display: block;
    }
    input {
        width: 100%;
    }
</style>

<fieldset>
    {#if label}
        <label for="input-{name}">{label}</label>
    {/if}
    <input
        id="input-{name}"
        name={name}
        {maxlength}
        bind:value={value}
    >
    <slot />
</fieldset>
