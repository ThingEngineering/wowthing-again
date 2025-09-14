<script lang="ts">
    import { charactersState } from '@/stores/local-storage';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
</script>

<style lang="scss">
    div {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
        margin-right: 1rem;
    }
    button {
        align-items: center;
        background: var(--color-highlight-background);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        display: flex;
        padding-left: 0.2rem;
        padding-right: 0.2rem;
    }
</style>

<div>
    <button>
        <CheckboxInput name="show_learned" bind:value={$charactersState.professionsShowLearned}
            >Learned</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_unlearned" bind:value={$charactersState.professionsShowUnlearned}
            >Unlearned</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_already_crafted"
            bind:value={$charactersState.professionsShowAlreadyCrafted}
            >Already crafted</CheckboxInput
        >
    </button>
</div>
