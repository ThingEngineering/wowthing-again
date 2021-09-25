<script lang="ts">
    import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'

    export let name: string
    export let textClass: string
    export let value: boolean
</script>

<style lang="scss">
    label {
        cursor: pointer;
        position: relative;
    }
    input {
        cursor: pointer;
        height: 0;
        opacity: 0;
        position: absolute;
        width: 0;
    }
</style>

<fieldset>
    <label for="input-{name}">
        <input id="input-{name}" name={name} type="checkbox" bind:checked={value}>
        <Fa fw icon={value ? faCheckSquare : faSquare} />
        <span class="text {textClass || ''}"><slot /></span>
    </label>
</fieldset>
