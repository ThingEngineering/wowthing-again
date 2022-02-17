<script lang="ts">
    import { userStore } from '@/stores'
    import backgroundThumbUrl from '@/utils/background-thumb-url'
    import tippy from '@/utils/tippy'
    import type { Character } from '@/types'

    export let character: Character
    export let selected: number

    const onClick = function(this: HTMLElement): void {
        selected = parseInt(this.getAttribute('data-id'))
    }
</script>

<style lang="scss">
    .configure {
        margin-top: 2rem;
    }
    .background {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        img {
            border-width: 2px;
            cursor: pointer;
        }
    }
    .selected {
        border: 2px solid $colour-success;
    }
</style>

<div class="configure">
    <div class="background">
        {#each $userStore.data.backgroundList as background}
            <img
                class="border"
                class:selected={background.id === selected}
                src="{backgroundThumbUrl(background)}"
                alt="{background.description}"
                data-id={background.id}
                on:click={onClick}
                use:tippy={background.description}
            >
        {/each}
    </div>
</div>
