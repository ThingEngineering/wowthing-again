<script lang="ts">
  import {data} from '../stores/user-store'

  import ClassIcon from './images/ClassIcon.svelte'
  import RaceIcon from './images/RaceIcon.svelte'
</script>

<style lang="scss">
  @import "../../scss/variables.scss";

  section {
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
  .realm {
    font-size: 0.9rem;
  }
</style>

<section>
    {#each $data.characters as character}
        <article class="{character.faction === 0 ? 'faction0' : 'faction1'}">
            <RaceIcon size="48" character="{character}" />
            <ClassIcon size="48" character="{character}" />
            <div class="name">{character.name}</div>
            <div class="realm">{character.getRealmName()}</div>
            <div class="level">Level {character.level}</div>
        </article>
    {/each}
</section>
