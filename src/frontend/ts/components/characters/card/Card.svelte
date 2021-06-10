<script lang="ts">
    import {specializationMap} from '@/data/character-specialization'
    import {data as settings} from '@/stores/settings-store'
    import {data as userData} from '@/stores/user-store'
    import type {Character, CharacterSpecialization} from '@/types'
    import getRealmName from '@/utils/get-realm-name'
    import tippy from '@/utils/tippy'

    import CharacterCovenant from '@/components/common/CharacterCovenant.svelte'
    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import RaceIcon from '@/components/images/RaceIcon.svelte'
    import SpecializationIcon from '../../images/SpecializationIcon.svelte'

    export let character: Character

    let accountEnabled: boolean
    let accountTag: string | undefined
    let spec: CharacterSpecialization

    $: {
        accountEnabled = (character.accountId === undefined || $userData.accounts[character.accountId].enabled)
        accountTag = $userData.accounts?.[character.accountId]?.tag
        spec = specializationMap[character.activeSpecId]
    }
</script>

<style lang="scss">
    article {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-large;
        display: inline-block;
        padding: 0.5rem 0.75rem;
        position: relative;
        text-align: center;

        &.inactive {
            opacity: $inactive-opacity;
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
        border-radius: $border-radius-large;
        font-size: 0.8rem;
        left: -1px;
        line-height: 1;
        padding: 0.2rem 0.3rem;
        position: absolute;
        top: -1px;
        z-index: 10;
    }
    .icons {
        display: flex;
        justify-content: space-around;
        position: relative;
    }
    .icons :global(img) {
        border-radius: $border-radius;
    }
    .spec {
        height: 28px;
        pointer-events: none;
        position: absolute;
        right: -1px;
        top: -5px;
        width: 28px;

        & :global(img) {
            border-width: 2px;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.75);
        }
    }
    .faction0 .spec :global(img) {
        border-color: $alliance-border-dark;
    }
    .faction1 .spec :global(img) {
        border-color: $horde-border-dark;
    }
    .level, .item-level {
        position: absolute;
        bottom: -10px;
        background: $thing-background;
        border: 1px solid lighten($border-color, 20%);
        border-radius: $border-radius;
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
        color: #cbcdcf;
        font-size: 0.9rem;
    }
</style>

<article class:faction0={character.faction === 0} class:faction1={character.faction === 1} class:inactive={!accountEnabled}>
    {#if accountTag}
        <div class="tag">{accountTag}</div>
    {/if}
    <div class="icons">
        <RaceIcon size={48} {character} />
        <ClassIcon size={48} {character} />
        {#if spec !== undefined}
            <div class="spec">
                <SpecializationIcon {character} size={24} border={2} />
            </div>
        {/if}
        <div class="level" use:tippy={{content: `Level ${character.level}`}}>{character.level}</div>
        <div class="item-level quality{character.calculatedItemLevelQuality}" use:tippy={{content: `Item Level ${character.equippedItemLevel}`}}>{character.calculatedItemLevel}</div>
    </div>
    <div class="name">{character.name}</div>
    {#if $settings.general.showRealm}
        <div class="realm">{getRealmName(character.realmId)}</div>
    {/if}
    {#if character.shadowlands}
        <CharacterCovenant {character} />
    {/if}
</article>
