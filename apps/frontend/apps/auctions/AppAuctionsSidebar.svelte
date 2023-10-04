<script lang="ts">
    import { replace } from 'svelte-spa-router'

    import { auctionStore } from '@/stores/auction'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'
    import TextInput from '@/components/forms/TextInput.svelte'
    import type { SidebarItem } from '@/types'
    import type { AuctionCategory } from '@/types/data/auction'

    let searchValue: string

    const onSubmit = async function() {
        if (searchValue?.trim()?.length > 0) {
            replace(`/search/${encodeURIComponent(searchValue)}`)
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
</style>

<Sidebar
    baseUrl={'/browse'}
    items={$auctionStore.categories}
    scrollable={true}
    width={'16rem'}
    dataFunc={dataFunc}
>
    <div slot="before" class="before">
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
