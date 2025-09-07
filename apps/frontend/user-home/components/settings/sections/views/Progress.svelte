<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';
    import { expansionOrder } from '@/data/expansion';

    let { active, view = $bindable() }: { active: boolean; view: SettingsView } = $props();

    let progressFilter = $state('');

    let progressChoices = $derived.by(() => {
        const ret: SettingsChoice[] = [];

        for (const categories of wowthingData.manual.progressSets.filter((p) => !!p)) {
            let { name: setName, slug: setSlug } = categories[0];
            if (['Dungeons', 'Raid Skips', 'Travel', 'Upgrades'].includes(setName)) {
                continue;
            }

            const expansion = expansionOrder.find((expansion) => expansion.name === setName);
            if (expansion) {
                setName = expansion.shortName;
            }

            for (let categoryIndex = 1; categoryIndex < categories.length; categoryIndex++) {
                const category = categories[categoryIndex];
                if (category === null || category.name === 'separator') {
                    continue;
                }

                for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                    const group = category.groups[groupIndex];
                    if (group === null || group.name === 'separator') {
                        continue;
                    }

                    ret.push({
                        id: `${setSlug}|${category.slug}|${groupIndex}`,
                        name: `[${setName}] ${category.name} > ${group.name}`,
                    });
                }
            }
        }

        return ret;
    });
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
</style>

{#if active}
    <div class="settings-block">
        <h3>Progress</h3>

        <div class="magic-filter">
            <TextInput
                name="progress_filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={progressFilter}
            />
        </div>

        <MagicLists
            key="progress"
            choices={progressChoices}
            filter={progressFilter}
            bind:activeStringIds={view.homeProgress}
        />
    </div>
{/if}
