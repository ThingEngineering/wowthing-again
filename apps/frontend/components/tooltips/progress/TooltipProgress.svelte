<script lang="ts">
    // import { covenantFeatureCost } from '@/data/covenant';
    import { Faction } from '@/enums/faction';
    import { ProgressDataType } from '@/enums/progress-data-type';
    import { QuestStatus } from '@/enums/quest-status';
    // import { wowthingData } from '@/shared/stores/data';
    // import { userAchievementStore } from '@/stores';
    import { getNameForFaction } from '@/utils/get-name-for-faction';
    import type { ManualDataProgressData, ManualDataProgressGroup } from '@/types/data/manual';
    import type { CharacterProps } from '@/types/props';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import QuestStatusIcon from '@/shared/components/icons/QuestStatusIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = CharacterProps & {
        datas: ManualDataProgressData[];
        descriptionText: Record<number, string>;
        group: ManualDataProgressGroup;
        iconOverride: string;
        nameOverride: Record<number, string>;
        statuses: QuestStatus[];
        showCurrencies?: number[];
    };

    let {
        character,
        datas,
        descriptionText: initialDescriptionText,
        group,
        iconOverride,
        nameOverride,
        statuses,
        showCurrencies = [],
    }: Props = $props();

    let [cls, dataChunks, descriptionText] = $derived.by(() => {
        let retCls: string;
        let retDataChunks: [ManualDataProgressData, number][][] = [[]];
        let retDescriptionText = initialDescriptionText;

        retCls = (datas || []).some((data, i) => {
            const desc = initialDescriptionText[i] || data.description;
            if (desc && desc.length > 20) {
                return true;
            }
        })
            ? 'long'
            : 'short';

        // Special cases
        // TODO: fix this better elsewhere
        // if (group.name === 'Valorous Appearances') {
        //     const cheev = wowthingData.achievements.achievementById.get(datas[1].ids[0]);
        //     const rootTree = wowthingData.achievements.criteriaTreeById.get(cheev.criteriaTreeId);
        //     const charCheev = $userAchievementStore.addonAchievements[character.id]?.[cheev.id];
        //     const newDesc = { ...initialDescriptionText };
        //     if (charCheev?.earned !== true) {
        //         for (let childIndex = 0; childIndex < rootTree.children.length; childIndex++) {
        //             const childTree = wowthingData.achievements.criteriaTreeById.get(
        //                 rootTree.children[childIndex]
        //             );
        //             newDesc[1] += `<br>${charCheev?.criteria?.[childIndex] > 0 ? '✔' : '❌'} ${childTree.description}`;
        //         }
        //     }
        //     retDescriptionText = newDesc;
        // } else if (datas.length === 1 && datas[0].type === ProgressDataType.SlCovenant) {
        //     const currentRank = parseInt(initialDescriptionText[0].split(' ')[1].split('/')[0]);
        //     const isSpecial = datas[0].value === 4;
        //     const prices = covenantFeatureCost[datas[0].value];

        //     const newDatas: ManualDataProgressData[] = [];
        //     const newDescriptionText: Record<number, string> = {};
        //     const newHaveIndexes: number[] = [];

        //     for (let rank = 1; rank <= (isSpecial ? 5 : 3); rank++) {
        //         newDatas.push({
        //             ...datas[0],
        //             name: `Rank ${rank}`,
        //         });

        //         newDescriptionText[rank - 1] =
        //             `{priceShort:${prices[rank - 1][0]}|1810}&nbsp;&nbsp;{priceShort:${prices[rank - 1][1]}|1813}`;

        //         if (currentRank >= rank) {
        //             newHaveIndexes.push(rank - 1);
        //         }
        //     }

        //     retCls = 'short';
        //     datas = newDatas;
        //     retDescriptionText = newDescriptionText;
        //     haveIndexes = newHaveIndexes;
        //     showCurrencies = [1810, 1813];
        // } else {
        //     showCurrencies = group.currencies || [];
        // }

        // Split data
        for (let dataIndex = 0; dataIndex < datas.length; dataIndex++) {
            const data = datas[dataIndex];
            if (data.name === 'separator') {
                retDataChunks.push([]);
                continue;
            }

            retDataChunks[retDataChunks.length - 1].push([data, dataIndex]);
        }

        // if (group.name.startsWith('Sojourner')) {
        //     console.log({group, dataChunks, descriptionText, haveIndexes, nameOverride});
        // }

        return [retCls, retDataChunks, retDescriptionText];
    });

    let groupName = $derived(
        group.lookup === 'faction'
            ? `:${Faction[character.faction].toLocaleLowerCase()}: ${getNameForFaction(group.name, character.faction)}`
            : group.name
    );
</script>

<style lang="scss">
    table:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
    }
    table + table {
        border-top: 1px solid var(--border-color);
        margin-top: 1rem;
    }
    .progress {
        --width: 1.2rem;

        padding-right: 0;
        vertical-align: top;
    }
    .name {
        padding-right: 1rem;
        text-align: left;
        width: 100%;

        :global(.description-short) {
            color: #00ccff;
            white-space: nowrap;
        }
        :global(.description-long) {
            color: #00ccff;
            display: block;
            margin-top: 0;
        }
    }
    .wowthing-tooltip {
        --image-border-width: 1px;
    }
    .bottom {
        span + span {
            margin-left: 0.5rem;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>
        <ParsedText cls="drop-shadow" text={groupName} />
    </h5>

    {#each dataChunks as dataChunk}
        <table class="table-striped">
            <tbody>
                {#each dataChunk as [data, dataIndex]}
                    {@const description = descriptionText[dataIndex] || data.description}
                    {@const status = statuses[dataIndex]}
                    <tr>
                        <td class="progress">
                            {#if iconOverride}
                                <WowthingImage name={iconOverride} size={20} border={1} />
                            {:else}
                                <QuestStatusIcon {status} useStatusColors={true} />
                            {/if}
                        </td>
                        <td class="name">
                            <ParsedText text={nameOverride[dataIndex] || data.name} />

                            {#if description && (status !== QuestStatus.Completed || group.type === 'dragon-racing' || datas[0].type === ProgressDataType.GarrisonTree)}
                                {#if cls === 'short'}&ndash;{/if}
                                <ParsedText cls="description-{cls}" text={description} />
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/each}

    {#if showCurrencies?.length > 0 && !(showCurrencies.length === 1 && showCurrencies[0] === 0)}
        <div class="bottom">
            {#each showCurrencies as currencyId (currencyId)}
                <span>
                    {#if currencyId > 1000000}
                        <WowthingImage name="item/{currencyId - 1000000}" size={20} border={1} />
                        {character.getItemCount(currencyId - 1000000).toLocaleString()}
                    {:else}
                        <WowthingImage name="currency/{currencyId}" size={20} border={1} />
                        {(character.currencies?.[currencyId]?.quantity ?? 0).toLocaleString()}
                    {/if}
                </span>
            {/each}
        </div>
    {/if}
</div>
