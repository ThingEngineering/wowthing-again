<script lang="ts">
    import { classOrder } from '@/data/character-class';
    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { InventoryType } from '@/enums/inventory-type';
    import { iconLibrary, uiIcons } from '@/shared/icons';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import getPercentClass from '@/utils/get-percent-class';
    import type { LazyConvertibleModifier } from '@/user-home/state/lazy/convertible.svelte';

    import { convertibleTypes } from './data';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Tooltip from './DifficultyTooltip.svelte';

    export let classData: Record<number, Record<number, LazyConvertibleModifier>>;
    export let modifier: number;
</script>

<style lang="scss">
    th {
        font-weight: 600;
    }
    th.name {
        text-align: left;
    }
    .name {
        @include cell-width(10rem);
    }
    .counts {
        @include cell-width(3rem);

        border-left: 1px solid var(--border-color);
        text-align: center;
    }
    .item-slot {
        --image-margin-top: -5px;

        @include cell-width(6rem, $paddingLeft: 0px, $paddingRight: 0px);

        border-left: 1px solid var(--border-color);
        padding-bottom: 0.2rem;
        padding-top: 0.2rem;
        text-align: center;
    }
</style>

{#if classData}
    <div class="wrapper">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th class="name">
                        {#if modifier === AppearanceModifier.LookingForRaid}
                            Looking For Raid
                        {:else}
                            {AppearanceModifier[modifier]}
                        {/if}
                    </th>
                    <th class="counts">Now</th>
                    <th class="counts">Max</th>
                    {#each convertibleTypes as inventoryType}
                        <th class="item-slot">
                            {InventoryType[inventoryType]}
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each classOrder as classId}
                    {@const characterClass = wowthingData.static.characterClassById.get(classId)}
                    {@const slotsHave = Object.values(classData[classId] || {}).filter(
                        (mod) => mod.userHas
                    ).length}
                    {@const slotsCouldHave = Object.values(classData[classId] || {}).filter(
                        (mod) => mod.userHas || mod.anyIsConvertible || mod.anyIsUpgradeable
                    ).length}
                    {@const slotsTotal = Object.values(classData[classId] || {}).length}
                    <tr>
                        <td class="name class-{classId}">
                            {getGenderedName(characterClass.name, 0)}
                        </td>
                        <td class="counts {getPercentClass((slotsHave / slotsTotal) * 100)}">
                            {slotsHave}
                            /
                            {slotsTotal}
                        </td>
                        <td class="counts {getPercentClass((slotsCouldHave / slotsTotal) * 100)}">
                            {slotsCouldHave}
                            /
                            {slotsTotal}
                        </td>

                        {#each convertibleTypes as inventoryType}
                            {@const data = classData[classId]?.[inventoryType]}
                            <td
                                class="item-slot"
                                use:componentTooltip={{
                                    component: Tooltip,
                                    props: {
                                        characterClass,
                                        inventoryType,
                                        modifier: data,
                                    },
                                }}
                            >
                                {#if data?.userHas}
                                    <IconifyIcon extraClass="status-success" icon={uiIcons.yes} />
                                {:else if data?.anyIsConvertible || data?.anyIsPurchaseable || data?.anyIsUpgradeable}
                                    {#if data.anyIsPurchaseable}
                                        <IconifyIcon
                                            extraClass={data.anyCanAfford
                                                ? 'status-shrug'
                                                : 'status-fail'}
                                            icon={iconLibrary.mdiCurrencyUsd}
                                            scale="0.85"
                                        />
                                    {/if}

                                    {#if data.anyIsUpgradeable}
                                        <IconifyIcon
                                            extraClass={data.anyCanUpgrade
                                                ? 'status-shrug'
                                                : 'status-fail'}
                                            icon={uiIcons.plus}
                                        />
                                    {/if}

                                    {#if data.anyIsConvertible}
                                        <IconifyIcon
                                            extraClass={data.anyCanConvert
                                                ? 'status-shrug'
                                                : 'status-fail'}
                                            icon={iconLibrary.gameShurikenAperture}
                                            scale="0.85"
                                        />
                                    {/if}
                                {:else}
                                    <span class="status-fail">---</span>
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{:else}
    <p>NO DATA</p>
{/if}
