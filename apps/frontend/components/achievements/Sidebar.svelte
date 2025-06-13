<script lang="ts">
    import { achievementStore } from '@/stores';
    import { userState } from '@/user-home/state/user';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[];
    $: {
        categories = [
            {
                id: 0,
                name: 'Summary',
                slug: 'summary',
                children: [],
            },
            null,
            ...$achievementStore.categories,
        ];
    }

    const percentFunc = function (entry: SidebarItem): number {
        const cat = userState.achievements.categories[entry.id];
        return cat ? (cat.have / cat.total) * 100 : 0;
    };
</script>

<style lang="scss">
</style>

<Sidebar baseUrl="/achievements" items={categories} scrollable={true} width="17rem" {percentFunc}>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={userState.achievements.categories[0].havePoints}
            total={userState.achievements.categories[0].totalPoints}
        />
    </div>
</Sidebar>
