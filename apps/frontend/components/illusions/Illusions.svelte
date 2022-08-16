<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import find from 'lodash/find'

    import { manualStore, staticStore, userTransmogStore } from '@/stores'
    import { illusionState } from '@/stores/local-storage'
    //import getPercentClass from '@/utils/get-percent-class'
    import tippy from '@/utils/tippy'
    import type { ManualDataIllusionGroup } from '@/types/data/manual'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import SectionTitle from '@/components/collections/CollectionSectionTitle.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    let sections: [string, ManualDataIllusionGroup[]][]
    $: {
        sections = [
            ['Available', $manualStore.data.illusions.filter((group) => !group.name.startsWith('Unavailable'))],
            ['Unavailable', $manualStore.data.illusions.filter((group) => group.name.startsWith('Unavailable'))],
        ]
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .collection-v2-section {
        --column-count: 1;
        --column-gap: 1rem;
        --column-width: 18rem;

        width: 18.75rem;
        
        @media screen and (min-width: 830px) {
            --column-count: 2;
            width: 37.75rem;
        }
        @media screen and (min-width: 1135px) {
            --column-count: 3;
            width: 56.75rem;
        }
        @media screen and (min-width: 1440px) {
            --column-count: 4;
            width: 75.75rem;
        }
        @media screen and (min-width: 1745) {
            --column-count: 5;
            width: 94.75rem;
        }
    }
    .collection-object {
        min-height: 52px;
        width: 52px;
    }
    .pill {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        margin-top: -1px;
    }
    .player-class {
        --image-border-radius: 50%;
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        left: -1px;
        width: 24px;
        position: absolute;
        top: -1px;
    }

</style>

<div class="wrapper">
    <div class="options-container">
        <button>
            <CheckboxInput
                name="highlight_missing"
                bind:value={$illusionState.highlightMissing}
            >Highlight missing</CheckboxInput>
        </button>
    
        <!-- <span>Show:</span>
    
        <button>
            <CheckboxInput
                name="show_collected"
                bind:value={$illusionState.showCollected}
            >Collected</CheckboxInput>
        </button>
    
        <button>
            <CheckboxInput
                name="show_uncollected"
                bind:value={$illusionState.showUncollected}
            >Missing</CheckboxInput>
        </button> -->
    </div>

    <div class="collection thing-container">
        {#each sections as [name, groups]}
            <SectionTitle
                count={null}
                title={name}
            />
            <div class="collection-v2-section">
                {#each groups as group}
                    <div class="collection-v2-group">
                        <h4 class="drop-shadow">
                            {group.name.replace('Unavailable - ', '')}
                        </h4>
                        <div class="collection-objects">
                            {#each group.items as item}
                                {@const illusion = find($staticStore.data.illusions, (illusion) => illusion.enchantmentId === item.enchantmentId)}
                                {@const have = $userTransmogStore.data.hasIllusion[illusion.enchantmentId] === true}
                                <div
                                    class="collection-object"
                                    class:missing={
                                        ($illusionState.highlightMissing && have) ||
                                        (!$illusionState.highlightMissing && !have)
                                    }
                                    use:tippy={illusion.name}
                                >
                                    <WowthingImage
                                        name="enchantment/{item.enchantmentId}"
                                        size={48}
                                        border={2}
                                    />

                                    {#if have}
                                        <div class="collected-icon drop-shadow">
                                            <IconifyIcon icon={mdiCheckboxOutline} />
                                        </div>
                                    {/if}

                                    {#each (item.classes || []) as classId}
                                        <div class="player-class class-{classId} drop-shadow">
                                            <ClassIcon
                                                border={2}
                                                size={20}
                                                {classId}
                                            />
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
