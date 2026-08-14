<script lang="ts">
    import Button from '@/shared/components/forms/Button.svelte';

    let element: HTMLElement = $state(null);
    let inputs = $derived(element?.parentElement.parentElement.querySelectorAll('input'));

    const selectAll = () => {
        for (const input of inputs) {
            if (!input.checked) {
                input.click();
            }
        }
    };
    const selectNone = () => {
        for (const input of inputs) {
            if (input.checked) {
                input.click();
            }
        }
    };
</script>

<style lang="scss">
    div {
        display: flex;
        flex-wrap: none;
        gap: var(--padding-size);

        :global(button) {
            padding: 0.125rem var(--padding-size);
        }
        span {
            font-size: 90%;
        }
    }
</style>

<div bind:this={element}>
    <Button cls="bg-success" onclick={selectAll}><span>All</span></Button>
    <Button cls="bg-warn" onclick={selectNone}><span>None</span></Button>
</div>
