<script lang="ts">
    import { userStore } from '@/stores'
    import backgroundThumbUrl from '@/utils/background-thumb-url'
    import tippy from '@/utils/tippy'

    export let selected: number

    const onClick = function(this: HTMLElement): void {
        selected = parseInt(this.getAttribute('data-id'))
    }
</script>

<style lang="scss">
    .backgrounds {

        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        img {
            border-width: 2px;
            cursor: pointer;
        }
    }
    .selected {
        border-color: $colour-success;
    }
</style>

<div class="backgrounds">
    {#each $userStore.data.backgroundList as background}
        <img
            src="{backgroundThumbUrl(background)}"
            alt="{background.description}"
            class="border"
            class:selected={background.id === selected}
            data-id={background.id}
            on:click={onClick}
            on:keypress={onClick}
            use:tippy={background.description}
        >
    {/each}
</div>
