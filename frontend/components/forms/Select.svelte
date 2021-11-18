<script lang="ts">
    export let name: string
    export let options: [number|string, number|string][]
    export let selected: number|string
</script>

<style lang="scss">

</style>

<select
    name={name}
    bind:value={selected}
>
    {#each options as [value, text]}
        <option value="{value}">{text}</option>
    {/each}
</select>
