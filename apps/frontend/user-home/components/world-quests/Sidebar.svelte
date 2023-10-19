<script lang="ts">
    import { zoneData } from './data'
    import { worldQuestState } from './state'
    import { Region } from '@/enums/region'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    const setRegion = function(region: string) {
        $worldQuestState.region = Region[region.toUpperCase() as keyof typeof Region]
    }
</script>

<style lang="scss">
    .before {
        margin-bottom: 1rem;
    }
    .regions {
        display: flex;
        justify-content: space-around;
        margin-bottom: 1rem;
        width: 100%;
        
        button {
            border-radius: $border-radius;
            cursor: pointer;
            flex-basis: 22%;

            &:global(.active) {
                background: $active-background;
                border-color: #fff;
            }
        }
    }
</style>

<Sidebar
    alwaysExpand={true}
    baseUrl="/world-quests"
    items={zoneData}
    width="12rem"
>
    <div slot="before" class="before">
        <div class="regions">
            {#each ['us', 'eu', 'kr', 'tw'] as region}
                <button
                    class="border"
                    class:active={Region[$worldQuestState.region].toLowerCase() === region}
                    on:click={() => setRegion(region)}
                >
                    {region.toUpperCase()}
                </button>
            {/each}
        </div>
    </div>
</Sidebar>
