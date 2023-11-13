<script lang="ts">
    import { CharacterFlag } from '@/enums/character-flag'
    import { iconLibrary } from '@/shared/icons'
    import { characterSettingsStore } from '@/stores/character-settings'
    import { settingsStore } from '@/shared/stores/settings/store'
    import type { Character } from '@/types/character'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'

    export let character: Character

    let ignoreWorkOrders: boolean = (
        ($settingsStore.characters.flags[character.id] || 0)
        & CharacterFlag.IgnoreWorkOrders
    ) > 0

    $: onClick = () => {
        if ($characterSettingsStore === character.id) {
            $characterSettingsStore = 0
        }
        else {
            $characterSettingsStore = character.id
        }
    }
    
    $: ignoreWorkOrdersChanged = () => {
        ($settingsStore.characters.flags ||= {})[character.id] ^= CharacterFlag.IgnoreWorkOrders
    }
</script>

<style lang="scss">
    td {
        padding-left: calc($width-padding * var(--padding, 1));
    }
    .settings-icon {
        cursor: pointer;
        position: relative;
    }
    .options-menu {
        border-radius: $border-radius;
        padding: 0.2rem 0.4rem;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateX(100%) translateY(-50%);
    }
</style>

<td class="settings">
    <div
        class="settings-icon"
    >
        <IconifyIcon
            icon={iconLibrary.mdiCogOutline}
            tooltip={'Character settings'}
            on:click={onClick}
        />

        {#if $characterSettingsStore === character.id}
            <div class="options-menu border">
                <CheckboxInput
                    name=""
                    bind:value={ignoreWorkOrders}
                    on:change={ignoreWorkOrdersChanged}
                >Ignore work orders</CheckboxInput>
            </div>
        {/if}
    </div>
</td>
