<script lang="ts">
    import {data as userData} from '../../../stores/user-store'
    import {Character} from '../../../types'
    import getRealmName from '../../../utils/get-realm-name'
    import tippy from '../../../utils/tippy'

    import ClassIcon from '../../images/ClassIcon.svelte'
    import RaceIcon from '../../images/RaceIcon.svelte'
    import CharacterShadowlands from '../CharacterCovenant.svelte'

    export let character: Character

    $: accountEnabled = (character.accountId === undefined || $userData.accounts[character.accountId].enabled)
    $: accountTag = $userData.accounts?.[character.accountId]?.tag
</script>

<style lang="scss">
    @import "../../../../scss/variables.scss";

    article {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: 8px;
        display: inline-block;
        padding: 0.5rem 0.75rem;
        position: relative;
        text-align: center;

        &.disabled {
            opacity: 0.5;
        }
        &.faction0 {
            background: mix($thing-background, $alliance-border, 90%);
            border-color: mix($border-color, $alliance-border, 60%);
        }
        &.faction1 {
            background: mix($thing-background, $horde-border, 90%);
            border-color: mix($border-color, $horde-border, 60%);
        }
    }
    .tag {
        background: $thing-background;
        border: 1px solid lighten($border-color, 20%);
        border-radius: 8px;
        font-size: 0.8rem;
        left: 0;
        line-height: 1;
        padding: 0.2rem 0.3rem;
        position: absolute;
        top: 0;
        z-index: 10;
    }
    .icons {
        display: flex;
        justify-content: space-around;
        position: relative;
    }
    .icons :global(img) {
        border-radius: 0.5rem;
    }
    .level, .item-level {
        position: absolute;
        bottom: -10px;
        background: $thing-background;
        border: 1px solid lighten($border-color, 20%);
        border-radius: 0.5rem;
        color: #ffff88;
        font-size: 0.8rem;
        letter-spacing: 0.0625em;
        line-height: 1;
        padding: 0.2rem 0.3rem;
    }
    .level {
        left: 27px;
        transform: translateX(-50%);
    }
    .item-level {
        right: 27px;
        transform: translateX(50%);
    }
    .name {
        margin-top: 0.6rem;
    }
    .realm {
        font-size: 0.9rem;
    }
</style>

<article class:faction0={character.faction === 0} class:faction1={character.faction === 1} class:disabled={!accountEnabled}>
    {#if accountTag}
        <div class="tag">{accountTag}</div>
    {/if}
    <div class="icons">
        <RaceIcon size="48" character={character} />
        <ClassIcon size="48" character={character} />
        <div class="level" use:tippy={{content: `Level ${character.level}`}}>{character.level}</div>
        <div class="item-level" use:tippy={{content: `Item Level ${character.equippedItemLevel}`}}>⚔{character.equippedItemLevel}</div>
    </div>
    <div class="name">{character.name}</div>
    <div class="realm">{getRealmName(character.realmId)}</div>
    {#if character.shadowlands}
        <div class="covenant">
            <CharacterShadowlands character={character} />
        </div>
    {/if}
</article>
