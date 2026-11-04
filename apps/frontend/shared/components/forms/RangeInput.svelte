<script lang="ts">
    type Props = {
        max: number;
        name: string;
        value: number;
        label?: string;
        min?: number;
        step?: number;
    };
    let { max, name, value = $bindable(), label, min = 0, step = 1 }: Props = $props();
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
        <label for="input-{name}">{@html label}</label>
    {/if}

    <input id="input-{name}" {name} type="range" {min} {max} {step} bind:value />
</fieldset>
