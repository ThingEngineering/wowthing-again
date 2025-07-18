<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { difficultyMap, journalDifficultyOrder } from '@/data/difficulty';
    import { ignoredLockoutInstances } from '@/data/dungeon';
    import { expansionMap } from '@/data/expansion';
    import { wowthingData } from '@/shared/stores/data';
    import { leftPad } from '@/utils/formatting';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let { active, view = $bindable() }: { active: boolean; view: SettingsView } = $props();

    let instanceFilter = $state('');

    let lockoutChoices = $derived.by(() => {
        const ret: SettingsChoice[] = [];

        const sortedInstances = sortBy(
            Array.from(wowthingData.static.instanceById.values()).filter(
                (instance) => instance !== null && !ignoredLockoutInstances[instance.id]
            ),
            (instance) => {
                const journalInstance = wowthingData.journal.instanceById[instance.id];
                return [
                    leftPad(instance.expansion, 2, '0'),
                    journalInstance?.isRaid ? 1 : 0,
                    leftPad(
                        journalInstance?.isRaid ? 999 - (journalInstance?.order || 0) : 0,
                        3,
                        '0'
                    ),
                    instance.name,
                ].join('|');
            }
        );

        for (const instance of sortedInstances) {
            const expansionName =
                instance.expansion === 100 ? 'Event' : expansionMap[instance.expansion].shortName;
            ret.push({
                id: instance.id.toString(),
                name: `[${expansionName}] ${instance.name}`,
            });

            const journalInstance = wowthingData.journal.instanceById[instance.id];
            if (instance.expansion < 100 && journalInstance?.isRaid) {
                for (const difficulty of journalDifficultyOrder) {
                    if (
                        journalInstance.bonusIds[difficulty] ||
                        (difficulty === 14 && journalInstance.bonusIds[16])
                    ) {
                        const difficultyName = difficultyMap[difficulty].shortName;
                        ret.push({
                            id: `${difficulty * 10000000 + instance.id}`,
                            name: `[${expansionName}] [${difficultyName}] ${instance.name}`,
                        });
                    }
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
        <h3>Lockouts</h3>

        <div class="magic-filter">
            <TextInput
                name="lockouts_filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={instanceFilter}
            />
        </div>

        <MagicLists
            key="lockouts"
            choices={lockoutChoices}
            filter={instanceFilter}
            bind:activeNumberIds={view.homeLockouts}
        />
    </div>
{/if}
