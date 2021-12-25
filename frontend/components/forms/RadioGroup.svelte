<script lang="ts">
    import iconBlank from '@iconify/icons-mdi/radiobox-blank'
    import iconSelected from '@iconify/icons-mdi/radiobox-marked'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let disabled = false
    export let name: string
    export let options: [string, string][]
    export let textClass = ''
    export let value: string
</script>

<style lang="scss">
    label {
        & :global(svg) {
            margin-top: -4px;
        }

        span {
            margin-left: 0;
        }
    }
</style>

<fieldset
    class="fancy-checkbox"
    class:disabled
>
    {#each options as [optionValue, optionLabel], optionIndex}
        <label for="input-{name}-{optionIndex}">
            <input
                id="input-{name}-{optionIndex}"
                name={name}
                type="radio"
                value="{optionValue}"
                bind:group={value}
                {disabled}
            >
            <IconifyIcon
                icon={optionValue === value ? iconSelected : iconBlank}
            />
            <span class="text {textClass || ''}">{optionLabel}</span>
        </label>
    {/each}
</fieldset>
