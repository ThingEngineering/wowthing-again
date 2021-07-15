<script lang="ts">
    export let label: string
    export let name: string
    export let value: string
</script>

<style lang="scss">
    label {
        display: block;
    }
    input {
        margin-top: 0.4rem;
        width: 100%;
    }
</style>

<fieldset>
    <label for="input-{name}">{label}</label>
    <input id="input-{name}" name={name} bind:value={value} on:input>
    <slot />
</fieldset>
