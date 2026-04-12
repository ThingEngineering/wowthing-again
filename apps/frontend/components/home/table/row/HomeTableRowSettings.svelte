<script lang="ts">
    import { CharacterFlag } from '@/enums/character-flag';
    import { iconLibrary } from '@/shared/icons';
    import { characterSettingsStore } from '@/stores/character-settings';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { Character } from '@/types/character';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';

    export let character: Character;

    let ignoreWorkOrders: boolean =
        ((settingsState.value.characters.flags[character.id] || 0) &
            CharacterFlag.IgnoreWorkOrders) >
        0;

    const onClick = () => {
        if ($characterSettingsStore === character.id) {
            $characterSettingsStore = 0;
        } else {
            $characterSettingsStore = character.id;
        }
    };

    const ignoreWorkOrdersChanged = () => {
        (settingsState.value.characters.flags ||= {})[character.id] ^=
            CharacterFlag.IgnoreWorkOrders;
    };

    const toggleTag = (mask: number) => {
        let flags = (settingsState.value.characters.flags ||= {})[character.id] || 0;
        if ((flags & mask) === mask) {
            flags = flags ^ mask;
        } else {
            flags = flags | mask;
        }
        settingsState.value.characters.flags[character.id] = flags;
    };
</script>

<style lang="scss">
    .settings-icon {
        cursor: pointer;
        position: relative;
        width: 24px;
    }
    .options-connector {
        border-top: 1px solid var(--border-color);
        height: 1px;
        left: 9px;
        position: absolute;
        top: 50%;
        transform: translateX(100%);
        width: 0.7rem;
    }
    .options-menu {
        border-radius: var(--border-radius);
        padding: 0.2rem 0.4rem;
        position: absolute;
        top: 0;
        right: -8px;
        transform: translateX(100%);
    }
</style>

<td class="settings">
    <div class="settings-icon">
        <IconifyWrapper
            icon={iconLibrary.mdiCogOutline}
            tooltip="Character settings"
            onclick={onClick}
        />

        {#if $characterSettingsStore === character.id}
            <div class="options-connector"></div>
            <div class="options-menu border">
                <CheckboxInput
                    name="ignore-work-orders-{character.id}"
                    bind:value={ignoreWorkOrders}
                    on:change={ignoreWorkOrdersChanged}>Ignore work orders</CheckboxInput
                >
                {#each settingsState.value.tags || [] as tag}
                    {@const mask = 1 << tag.id}
                    <CheckboxInput
                        name="tag-{character.id}-{tag.id}"
                        value={((settingsState.value.characters.flags?.[character.id] || 0) &
                            mask) ===
                            mask}
                        on:change={() => toggleTag(mask)}>Tag: {tag.name}</CheckboxInput
                    >
                {/each}
            </div>
        {/if}
    </div>
</td>
