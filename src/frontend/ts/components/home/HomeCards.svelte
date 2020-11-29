<script lang="ts">
    import {data} from '../../stores/user-store'

    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'
    import CharacterShadowlands from './CharacterCovenant.svelte'
</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

    section {
        align-items: flex-start;
        display: grid;
        grid-template-columns: repeat(auto-fill, 8.5rem);
        grid-gap: 1rem;
        justify-content: left;
        width: 100%;
    }
    article {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: 8px;
        display: inline-block;
        padding: 0.5rem 0.75rem;
        text-align: center;

        &.faction0 {
            background: mix($thing-background, $alliance-border, 90%);
            border-color: mix($border-color, $alliance-border, 60%);
        }
        &.faction1 {
            background: mix($thing-background, $horde-border, 90%);
            border-color: mix($border-color, $horde-border, 60%);
        }
    }
    .icons {
        display: flex;
        justify-content: space-between;
        position: relative;
    }
    .icons :global(img) {
        border-radius: 0.5rem;
    }
    .level {
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        background: $thing-background;
        border: 1px solid lighten($border-color, 20%);
        border-radius: 0.5rem;
        color: #ffff88;
        letter-spacing: 0.0625em;
        line-height: 1;
        padding: 0.15rem 0.25rem;
    }
    .name {
        margin-top: 0.2rem;
    }
    .realm {
        font-size: 0.9rem;
    }
</style>

<section>
    {#each $data.characters as character}
        <article class="{character.faction === 0 ? 'faction0' : 'faction1'}">
            <div class="icons">
                <RaceIcon size="48" character={character} />
                <ClassIcon size="48" character={character} />
                <div class="level">{character.level}</div>
            </div>
            <div class="name">{character.name}</div>
            <div class="realm">{character.getRealmName()}</div>
            {#if character.shadowlands}
                <div class="covenant">
                    <CharacterShadowlands character={character} />
                </div>
            {/if}
        </article>
    {/each}
</section>
