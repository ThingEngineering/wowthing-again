<script lang="ts">
    import mdiCheckboxBlankOutline from '@iconify/icons-mdi/checkbox-blank-outline'
    import mdiCheckboxOutline from '@iconify/icons-mdi/checkbox-outline'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'

    export let disabled = false
    export let name: string
    export let textClass = ''
    export let value: boolean
</script>

<style lang="scss">
    label {
        & :global(svg) {
            margin-top: -4px;
        }
    }
</style>

<fieldset
    class="fancy-checkbox"
    class:disabled
    data-state="{value}"
>
    <label for="input-{name}">
        <input
            id="input-{name}"
            name={name}
            type="checkbox"
            bind:checked={value}
            {disabled}
        >
        <IconifyIcon
            icon={value ? mdiCheckboxOutline : mdiCheckboxBlankOutline}
        />
        <span class="text {textClass || ''}"><slot /></span>
    </label>
</fieldset>
