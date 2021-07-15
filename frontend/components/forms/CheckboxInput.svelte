<script lang="ts">
    export let label: string
    export let name: string
    export let value: boolean
</script>

<fieldset>
    <label for="input-{name}">
        <input id="input-{name}" name={name} type="checkbox" bind:checked={value}>
        {label}
    </label>
    <slot />
</fieldset>
