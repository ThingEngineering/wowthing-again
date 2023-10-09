<script lang="ts">
    import iconBlank from '@iconify/icons-mdi/radiobox-blank'
    import iconSelected from '@iconify/icons-mdi/radiobox-marked'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'

    export let disabled = false
    export let name: string
    export let options: [string, string][]
    export let value: string
</script>

<style lang="scss">
    label {
        white-space: nowrap;

        & :global(svg) {
            margin-top: -4px;
        }

        :global(span) {
            margin-left: 0;

            :global(svg) {
                margin-right: -0.75rem;
            }
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
            <ParsedText text={optionLabel} />
        </label>
    {/each}
</fieldset>
