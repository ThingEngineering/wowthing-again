<script lang="ts">
    import { classByArmorType } from '@/data/character-class';
    import { iconStrings } from '@/data/icons';
    import { PlayableClass } from '@/enums/playable-class';
    import { collectingSettingsState } from '@/stores/local-storage';
    import { settingsState } from '@/shared/state/settings.svelte';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '../../shared/components/parsed-text/ParsedText.svelte';

    const toggleExpanded = () => {
        $collectingSettingsState.expanded = !$collectingSettingsState.expanded;
    };

    const setAllClasses = (state: boolean) => {
        for (const playableClasses of Object.values(classByArmorType)) {
            for (const playableClass of playableClasses) {
                const className = PlayableClass[playableClass];
                settingsState.value.transmog[`show${className}`] = state;
            }
        }
    };
</script>

<style lang="scss">
    .collecting-settings {
        --image-margin-top: -2px;

        padding: 0.25rem 0.5rem;

        :global(fieldset) {
            margin-bottom: 0.25rem;
            margin-top: 0.25rem;
        }
    }
    .expand {
        --image-margin-top: 0;

        padding: 0;
        position: relative;
        text-align: left;
        width: 100%;

        :global(svg) {
            position: absolute;
            right: -0.4rem;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .spacer {
        border-bottom: 1px solid $border-color;
        margin: 0.2rem -0.5rem;
    }
    .flex-wrapper {
        justify-content: flex-start;
    }
    .button-wrapper {
        gap: 0.5rem;
        margin: 0.3rem 0;
        justify-content: center;

        button {
            background: $thing-background;
            border-radius: $border-radius;
            cursor: pointer;
            width: 4rem;

            &:hover {
                border-color: #aaa;
            }
        }
    }
</style>

<div class="border collecting-settings">
    <button class="expand" on:click|preventDefault|stopPropagation={toggleExpanded}>
        Collecting Settings
        <IconifyIcon
            icon={iconStrings['chevron-' + ($collectingSettingsState.expanded ? 'down' : 'right')]}
        />
    </button>

    {#if $collectingSettingsState.expanded}
        <div class="spacer"></div>

        <Checkbox
            name="transmog_completionistMode"
            bind:value={settingsState.value.transmog.completionistMode}>Completionist Mode</Checkbox
        >

        <Checkbox
            name="transmog_completionistSets"
            disabled={!settingsState.value.transmog.completionistMode}
            bind:value={settingsState.value.transmog.completionistSets}>Completionist Sets</Checkbox
        >

        <Checkbox
            name="collections_hideUnavailable"
            bind:value={settingsState.value.collections.hideUnavailable}>Hide Unavailable</Checkbox
        >

        <div class="spacer"></div>

        <div class="flex-wrapper">
            <Checkbox
                name="transmog_showAllianceOnly"
                bind:value={settingsState.value.transmog.showAllianceOnly}
                textClass="faction-alliance"
            >
                <ParsedText text=":alliance:" />
            </Checkbox>
            <Checkbox
                name="transmog_showHordeOnly"
                bind:value={settingsState.value.transmog.showHordeOnly}
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
                        bind:value={settingsState.value.transmog[`show${className}`]}
                        textClass="faction-horde"
                    >
                        <ClassIcon classId={playableClass} size={16} />
                    </Checkbox>
                {/each}
            </div>
        {/each}

        <div class="flex-wrapper button-wrapper">
            <button class="border" on:click={() => setAllClasses(true)}> All </button>
            <button class="border" on:click={() => setAllClasses(false)}> None </button>
        </div>
    {/if}
</div>
