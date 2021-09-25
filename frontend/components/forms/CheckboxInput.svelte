<script lang="ts">
    import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'

    export let name: string
    export let textClass = ''
    export let value: boolean
</script>

<style lang="scss">
</style>

<fieldset class="fancy-checkbox">
    <label for="input-{name}">
        <input
            id="input-{name}"
            name={name}
            type="checkbox"
            bind:checked={value}
        >
        <Fa fw icon={value ? faCheckSquare : faSquare} />
        <span class="text {textClass || ''}"><slot /></span>
    </label>
</fieldset>
