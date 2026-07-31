<script lang="ts">
    import { iconLibrary } from '@/shared/icons';
    import type { ChildrenProp } from '@/types/props';

    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';

    type Props = ChildrenProp & {
        bindGroup: string[];
        name: string;
        disabled?: boolean;
        textClass?: string;
        tooltip?: string;
        value?: string;
    };
    let {
        bindGroup = $bindable(),
        children,
        disabled,
        name,
        textClass,
        tooltip,
        value,
    }: Props = $props();

    let checked = $state(bindGroup.includes(value));

    function onChange(ev: Event) {
        const target = <HTMLInputElement>ev.target;
        if (target.checked) {
            bindGroup = [...bindGroup, target.value];
        } else {
            bindGroup = bindGroup.filter((item) => item !== target.value);
        }
        checked = target.checked;
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

<fieldset class="fancy-checkbox" class:disabled data-state={checked}>
    <label class="text-overflow" for="input-{name}" data-tooltip={tooltip}>
        <input
            id="input-{name}"
            {name}
            type="checkbox"
            {value}
            {checked}
            {disabled}
            onchange={onChange}
        />
        <IconifyWrapper
            icon={checked ? iconLibrary.mdiCheckboxOutline : iconLibrary.mdiCheckboxBlankOutline}
        />
        <span class="text {textClass || ''}">
            {@render children?.()}
        </span>
    </label>
</fieldset>
