<script lang="ts">
    import { location, replace } from 'svelte-spa-router'

    import { auctionsAppState } from '@/auctions/stores/state'
    import { Region } from '@/enums/region'
    import { auctionStore } from '@/stores/auction'
    import type { SidebarItem } from '@/shared/sub-sidebar/types'
    import type { AuctionCategory } from '@/types/data/auction'

    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'
    import TextInput from '@/shared/forms/TextInput.svelte'

    let searchValue: string

    const onSubmit = async function() {
        if (searchValue?.trim()?.length > 0) {
            replace(`/search/${Region[$auctionsAppState.region].toLowerCase()}/${encodeURIComponent(searchValue)}`)
        }
    }

    const setRegion = function(region: string) {
        const oldRegion = $auctionsAppState.region
        const newRegion = Region[region.toUpperCase() as keyof typeof Region]
        
        if (oldRegion !== newRegion) {
            $auctionsAppState.region = newRegion
            replace($location.replace(`/${Region[oldRegion].toLowerCase()}/`, `/${Region[newRegion].toLowerCase()}/`))
        }
    }

    function dataFunc(item: SidebarItem): string {
        const category = item as AuctionCategory
        return `${category.id}-${category.itemClass}-${category.itemSubClass}-${category.inventoryType}`
    }
</script>

<style lang="scss">
    .before {
        margin-bottom: 1rem;
        margin-top: 1px;
    }
    .regions {
        display: flex;
        justify-content: space-around;
        margin-bottom: 1rem;
        width: 100%;
        
        button {
            border-radius: $border-radius;
            cursor: pointer;
            flex-basis: 20%;
            font-size: 110%;

            &:global(.active) {
                background: $active-background;
                border-color: #fff;
            }
        }
    }
</style>

{#key $auctionsAppState.region}
    <Sidebar
        baseUrl={`/browse/${Region[$auctionsAppState.region].toLowerCase()}`}
        items={$auctionStore.categories}
        scrollable={true}
        width={'16rem'}
        dataFunc={dataFunc}
    >
        <div slot="before" class="before">
            <div class="regions">
                {#each ['us', 'eu', 'kr', 'tw'] as region}
                    <button
                        class="border"
                        class:active={Region[$auctionsAppState.region].toLowerCase() === region}
                        on:click={() => setRegion(region)}
                    >
                        {region.toUpperCase()}
                    </button>
                {/each}
            </div>

            <form
                on:submit|preventDefault={onSubmit}
            >
                <TextInput
                    name="auctions_search"
                    placeholder="Search..."
                    bind:value={searchValue}
                />
            </form>
        </div>
    </Sidebar>
{/key}
