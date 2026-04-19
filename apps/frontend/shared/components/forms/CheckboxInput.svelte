<script lang="ts">
    import type { Snippet } from 'svelte';

    import { iconLibrary } from '@/shared/icons';

    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';

    type Props = {
        name: string;
        value?: boolean;
        children?: Snippet;
        disabled?: boolean;
        onChange?: (newValue: boolean) => void;
        textClass?: string;
    };
    let {
        children,
        disabled,
        name,
        onChange,
        textClass,
        value = $bindable(false),
    }: Props = $props();
</script>

<style lang="scss">
    label {
        & :global(svg) {
            margin-top: -4px;
        }
    }
</style>

<fieldset class="fancy-checkbox" class:disabled data-state={value}>
    <label for="input-{name}" class="text-overflow">
        <input
            id="input-{name}"
            {name}
            type="checkbox"
            bind:checked={value}
            onchange={(event) => onChange((event.target as HTMLInputElement).checked)}
            {disabled}
        />
        <IconifyWrapper
            icon={value ? iconLibrary.mdiCheckboxOutline : iconLibrary.mdiCheckboxBlankOutline}
        />
        <span class="text {textClass || ''}">
            {@render children?.()}
        </span>
    </label>
</fieldset>
