<script lang="ts">
    export let label: string = undefined
    export let max: number
    export let min = 0
    export let name: string
    export let step = 1
    export let value: number
</script>

<style lang="scss">
    input {
        width: 100%;
    }
    label {
        display: block;
        margin-bottom: 0.2rem;
        text-align: center;
        width: 100%;
    }
</style>

<fieldset>
    {#if label}
        <label
            for="input-{name}"
        >{@html label}</label>
    {/if}
    
    <input
        id="input-{name}"
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        bind:value={value}
    />
</fieldset>
