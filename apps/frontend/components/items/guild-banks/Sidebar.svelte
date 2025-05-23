<script lang="ts">
    import groupBy from 'lodash/groupBy';

    import { userStore } from '@/stores';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { Guild } from '@/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    type GuildBankSidebarItem = SidebarItem & { count: number };

    let sidebarItems: GuildBankSidebarItem[];
    $: {
        const guildData: { characterCount: number; guild: Guild; maxTab: number }[] = [];

        const charactersByGuildId = groupBy(
            $userStore.activeCharacters.filter((char) => !!char.guild),
            (char) => char.guildId,
        );
        for (const guild of Object.values($userStore.guildMap)) {
            const characterCount = charactersByGuildId[guild.id]?.length || 0;
            if (characterCount > 0) {
                guildData.push({
                    characterCount,
                    guild,
                    maxTab: Math.max(0, ...guild.items.map((item) => item.tabId)),
                });
            }
        }

        guildData.sort((a, b) => {
            if (a.maxTab > 0 && b.maxTab === 0) {
                return -1;
            } else if (a.maxTab === 0 && b.maxTab > 0) {
                return 1;
            }

            if (a.guild.realm.name !== b.guild.realm.name) {
                return a.guild.realm.name.localeCompare(b.guild.realm.name);
            }

            return a.guild.name.localeCompare(b.guild.name);
        });

        sidebarItems = [];
        for (const { characterCount, guild, maxTab } of guildData) {
            const name = `${maxTab === 0 ? ':starEmpty:' : ':starFull:'} ${guild.realm.name} &ndash; ${guild.name}`;
            sidebarItems.push({
                id: guild.id,
                name,
                slug: `${guild.realm.slug}--${guild.slug}`,
                forceWildcard: true,
                count: characterCount,
            });
        }
    }
</script>

<Sidebar
    baseUrl="/items/guild-banks"
    items={sidebarItems}
    width="22rem"
    decorationFunc={(item) => item.count.toString()}
/>
