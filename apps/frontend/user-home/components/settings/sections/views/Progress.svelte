<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let { active, view = $bindable() }: { active: boolean; view: SettingsView } = $props();

    let progressFilter = $state('');

    let progressChoices = $derived.by(() => {
        const ret: SettingsChoice[] = [];

        for (let i = 0; i < wowthingData.manual.progressSets.length; i++) {
            const progressSets = wowthingData.manual.progressSets[i];
            if (progressSets === null) {
                continue;
            }

            const categoryName = progressSets[0].name;
            for (let j = 1; j < progressSets.length; j++) {
                const progressSet = progressSets[j];
                if (progressSet === null) {
                    continue;
                }

                ret.push({
                    id: `${i}_${j}`,
                    name: `[${categoryName}] ${progressSet.name}`,
                });
            }
        }

        console.log(wowthingData.manual.progressSets);

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
