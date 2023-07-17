<script lang="ts">
    import { classByArmorType } from '@/data/character-class'
    import { iconStrings } from '@/data/icons'
    import { PlayableClass } from '@/enums'
    import { settingsStore } from '@/stores'
    import { collectingSettingsState } from '@/stores/local-storage'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ParsedText from './ParsedText.svelte'

    const toggleExpanded = () => {
        $collectingSettingsState.expanded = !$collectingSettingsState.expanded
    }
</script>

<style lang="scss">
    .collecting-settings {
        --image-margin-top: -2px;

        margin-top: 0.75rem;
        padding: 0.15rem 0.5rem;

        :global(fieldset) {
            margin-bottom: 0.15rem;
            margin-top: 0.15rem;
        }
    }
    .expand {
        --image-margin-top: 0;

        position: relative;

        :global(svg) {
            position: absolute;
            right: -0.4rem;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .spacer {
        border-bottom: 1px solid $border-color;
        margin: 0.1rem -0.5rem;
    }
    .flex-wrapper {
        justify-content: flex-start;
    }
</style>

<div class="border collecting-settings">
    <div
        class="expand"
        on:click|preventDefault|stopPropagation={toggleExpanded}
        on:keypress|preventDefault|stopPropagation={toggleExpanded}
    >
        Collecting Settings
        <IconifyIcon
            icon={iconStrings['chevron-' + ($collectingSettingsState.expanded ? 'down' : 'right')]}
        />
    </div>
    
    {#if $collectingSettingsState.expanded}
        <div class="spacer"></div>

        <Checkbox
            name="transmog_completionistMode"
            bind:value={$settingsStore.transmog.completionistMode}
        >Completionist Mode</Checkbox>

        <div class="spacer"></div>

        <div class="flex-wrapper">
            <Checkbox
                name="transmog_showAllianceOnly"
                bind:value={$settingsStore.transmog.showAllianceOnly}
                textClass="faction-alliance"
            >
                <ParsedText text=":alliance:" />
            </Checkbox>
            <Checkbox
                name="transmog_showHordeOnly"
                bind:value={$settingsStore.transmog.showHordeOnly}
                textClass="faction-horde"
            >
                <ParsedText text=":horde:" />
            </Checkbox>
        </div>

        <div class="spacer"></div>

        {#each Object.values(classByArmorType) as playableClasses}
            <div class="flex-wrapper">
                {#each playableClasses as playableClass}
                    {@const className = PlayableClass[playableClass]}
                    <Checkbox
                        name="transmog_show{className}"
                        bind:value={$settingsStore.transmog[`show${className}`]}
                        textClass="faction-horde"
                    >
                        <ClassIcon
                            classId={playableClass}
                            size={16}
                        />
                    </Checkbox>
                {/each}
            </div>
        {/each}
    {:else}
    {/if}
</div>
