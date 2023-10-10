<script lang="ts">
    import { settingsStore, userStore } from '@/stores'
    import backgroundThumbUrl from '@/utils/background-thumb-url'
    import { basicTooltip } from '@/shared/utils/tooltips'

    export let selected: number
    export let showDefault = false

    const onClick = function(this: HTMLElement): void {
        selected = parseInt(this.getAttribute('data-id'))
    }
</script>

<style lang="scss">
    .backgrounds {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
    .background {
        border-width: 2px;
        cursor: pointer;
    }
    .background {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 115px;
        position: relative;
        width: 162px;

        &.selected {
            border-color: $colour-success;
        }
        code {
            border-bottom-width: 0;
            bottom: -1px;
        }
        img {
            height: 100%;
            object-fit: contain;
            width: 100%;
        }
    }
    code {
        font-size: 1.2rem;
        margin: auto;
    }
</style>

<div class="backgrounds">
    {#each $userStore.backgroundList as background}
        <div
            class="background border"
            class:selected={selected === background.id}
        >
            <img
                src="{backgroundThumbUrl(background)}"
                alt="{background.description}"
                data-id={background.id}
                on:click={onClick}
                on:keypress={onClick}
                use:basicTooltip={background.description}
            >

            {#if showDefault && background.id === $settingsStore.characters.defaultBackgroundId}
                <code class="pill abs-center">DEFAULT</code>
            {/if}
        </div>
    {/each}

    {#if showDefault}
        <div
            class="background border"
            class:selected={selected === -1}
            data-id={-1}
            on:click={onClick}
            on:keypress={onClick}
        >
            <code>DEFAULT</code>
        </div>
    {/if}
</div>
