<script lang="ts">
    import { CharacterFlag } from '@/enums/character-flag';
    import { iconLibrary } from '@/shared/icons';
    import { characterSettingsStore } from '@/stores/character-settings';
    import { settingsStore } from '@/shared/stores/settings/store';
    import type { Character } from '@/types/character';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    export let character: Character;

    let ignoreWorkOrders: boolean =
        (($settingsStore.characters.flags[character.id] || 0) & CharacterFlag.IgnoreWorkOrders) > 0;

    const onClick = () => {
        if ($characterSettingsStore === character.id) {
            $characterSettingsStore = 0;
        } else {
            $characterSettingsStore = character.id;
        }
    };

    const ignoreWorkOrdersChanged = () => {
        ($settingsStore.characters.flags ||= {})[character.id] ^= CharacterFlag.IgnoreWorkOrders;
    };

    const toggleTag = (mask: number) => {
        let flags = ($settingsStore.characters.flags ||= {})[character.id] || 0;
        if ((flags & mask) === mask) {
            flags = flags ^ mask;
        } else {
            flags = flags | mask;
        }
        $settingsStore.characters.flags[character.id] = flags;
    };
</script>

<style lang="scss">
    td {
        padding-left: calc($width-padding * var(--padding, 1));
    }
    .settings-icon {
        cursor: pointer;
        position: relative;
    }
    .options-connector {
        border-top: 1px solid #ddd;
        height: 1px;
        left: 15px;
        position: absolute;
        top: 50%;
        transform: translateX(100%);
        width: 0.7rem;
    }
    .options-menu {
        border-radius: $border-radius;
        padding: 0.2rem 0.4rem;
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(100%);
    }
</style>

<td class="settings">
    <div class="settings-icon">
        <IconifyIcon
            icon={iconLibrary.mdiCogOutline}
            tooltip="Character settings"
            on:click={onClick}
        />

        {#if $characterSettingsStore === character.id}
            <div class="options-connector"></div>
            <div class="options-menu border">
                <CheckboxInput
                    name="ignore-work-orders-{character.id}"
                    bind:value={ignoreWorkOrders}
                    on:change={ignoreWorkOrdersChanged}>Ignore work orders</CheckboxInput
                >
                {#each $settingsStore.tags || [] as tag}
                    {@const mask = 1 << tag.id}
                    <CheckboxInput
                        name="tag-{character.id}-{tag.id}"
                        value={(($settingsStore.characters.flags?.[character.id] || 0) & mask) ===
                            mask}
                        on:change={() => toggleTag(mask)}>Tag: {tag.name}</CheckboxInput
                    >
                {/each}
            </div>
        {/if}
    </div>
</td>
