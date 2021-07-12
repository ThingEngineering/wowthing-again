<script lang="ts">
    import { data } from '@/stores/achievements'
    import type {AchievementDataCategory} from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    let categories: AchievementDataCategory[]
    $: {
        categories = [
            {
                id: 0,
                name: 'Summary',
                slug: 'summary',
                children: [],
            },
            null,
            ...$data.categories,
        ]
    }
</script>

<Sidebar baseUrl="/achievements" items={categories} width="13rem" linkColor="#64e1ff" />
