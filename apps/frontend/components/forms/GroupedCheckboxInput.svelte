<script lang="ts">
    import mdiCheckboxBlankOutline from '@iconify/icons-mdi/checkbox-blank-outline'
    import mdiCheckboxOutline from '@iconify/icons-mdi/checkbox-outline'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let bindGroup: string[]
    export let disabled = false
    export let name: string
    export let textClass = ''
    export let value = ''

    let checked = bindGroup.indexOf(value) >= 0

    function onChange(ev: Event) {
        const target = <HTMLInputElement>ev.target
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
    fieldset {
        white-space: nowrap;
    }
    label {
        & :global(svg) {
            margin-top: -4px;
        }
    }
</style>

<fieldset
    class="fancy-checkbox"
    class:disabled
    data-state="{checked}"
>
    <label
        class="text-overflow"
        for="input-{name}"
    >
        <input
            id="input-{name}"
            name={name}
            type="checkbox"
            {value}
            {checked}
            {disabled}
            on:change={onChange}
        >
        <IconifyIcon
            icon={checked ? mdiCheckboxOutline : mdiCheckboxBlankOutline}
        />
        <span class="text {textClass || ''}"><slot /></span>
    </label>
</fieldset>
