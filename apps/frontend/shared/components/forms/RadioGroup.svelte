<script lang="ts">
    import { iconLibrary } from '@/shared/icons';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    type Props = {
        disabled?: boolean;
        name: string;
        options: [string, string][];
        value: string;
    };
    let { disabled, name, options, value = $bindable() }: Props = $props();
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

<fieldset class="fancy-checkbox" class:disabled>
    {#each options as [optionValue, optionLabel], optionIndex (optionValue)}
        <label for="input-{name}-{optionIndex}">
            <input
                id="input-{name}-{optionIndex}"
                {name}
                type="radio"
                value={optionValue}
                bind:group={value}
                {disabled}
            />
            <IconifyIcon
                icon={optionValue === value
                    ? iconLibrary.mdiRadioboxMarked
                    : iconLibrary.mdiRadioboxBlank}
            />
            <ParsedText text={optionLabel} />
        </label>
    {/each}
</fieldset>
