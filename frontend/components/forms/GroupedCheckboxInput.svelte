<script lang="ts">
    import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'

    export let bindGroup: string[]
    export let name: string
    export let textClass = ''
    export let value = ''

    let checked = bindGroup.indexOf(value) >= 0

    function onChange({ target }: any) {
        if (target.checked) {
            bindGroup = [...bindGroup, target.value]
        }
        else {
            bindGroup = bindGroup.filter((item) => item !== target.value)
        }
        checked = target.checked
    }
</script>

<style lang="scss">
</style>

<fieldset class="fancy-checkbox" data-state="{checked}">
    <label for="input-{name}">
        <input
            id="input-{name}"
            name={name}
            type="checkbox"
            {value}
            {checked}
            on:change={onChange}
        >
        <Fa fw icon={checked ? faCheckSquare : faSquare} />
        <span class="text {textClass || ''}"><slot /></span>
    </label>
</fieldset>
