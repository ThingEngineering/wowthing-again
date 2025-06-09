<script lang="ts">
    import groupBy from 'lodash/groupBy';
    import sortBy from 'lodash/sortBy';
    import xor from 'lodash/xor';

    import { classOrder } from '@/data/character-class';
    import { Constants } from '@/data/constants';
    import { isSecondaryProfession, professionOrder } from '@/data/professions';
    import { Gender, genderValues } from '@/enums/gender';
    import { Region } from '@/enums/region';
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { userStore } from '@/stores';
    import { cartesianProduct } from '@/utils/cartesian-product';
    import type { StaticDataRealm } from '@/shared/stores/static/types';
    import type { Character } from '@/types';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import RadioGroup from '@/shared/components/forms/RadioGroup.svelte';
    import Row from './Row.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';
    import { wowthingData } from '@/shared/stores/data';

    let matrix: Record<string, Character[]>;
    let xCounts: Record<string, number>;
    let xEntries: string[][];
    let xKeys: string[];
    let yCounts: Record<string, number>;
    let yEntries: string[][];
    let yKeys: string[];
    $: {
        const characters = $userStore.characters.filter(
            (char) =>
                settingsState.value.characters.hiddenCharacters.indexOf(char.id) === -1 &&
                settingsState.value.characters.ignoredCharacters.indexOf(char.id) === -1 &&
                char.level >= browserState.current.matrix.minLevel &&
                settingsState.value.accounts?.[char.accountId]?.enabled === true
        );

        const realmMap: Record<number, StaticDataRealm> = {};
        for (const character of characters) {
            realmMap[character.realmId] = character.realm;
        }

        const realms: [string, string, StaticDataRealm][] = Object.values(realmMap).map((realm) => [
            Region[realm.region],
            wowthingData.static.connectedRealmById.get(realm.connectedRealmId)?.displayText ||
                `Realm #${realm.connectedRealmId}`,
            realm,
        ]);
        //realms.sort()

        const sortedX = sortBy(browserState.current.matrix.xAxis, (key) => axisOrder.indexOf(key));
        const sortedY = sortBy(browserState.current.matrix.yAxis, (key) => axisOrder.indexOf(key));

        const allAxis = sortBy(
            [...browserState.current.matrix.xAxis, ...browserState.current.matrix.yAxis],
            (key) => axisOrder.indexOf(key)
        );

        matrix = Object.fromEntries(
            sortBy(
                Object.entries(
                    groupBy(characters, (char) => {
                        const parts: (number | string)[] = [];

                        parts.push(
                            allAxis.indexOf('realm') >= 0 ? char.realm.connectedRealmId : null
                        );

                        parts.push(
                            allAxis.indexOf('account') >= 0
                                ? settingsState.value.accounts?.[char.accountId]?.tag ||
                                      char.accountId
                                : null
                        );

                        parts.push(allAxis.indexOf('faction') >= 0 ? char.faction : null);
                        parts.push(allAxis.indexOf('gender') >= 0 ? char.gender : null);
                        parts.push(allAxis.indexOf('race') >= 0 ? char.raceId : null);
                        parts.push(allAxis.indexOf('class') >= 0 ? char.classId : null);

                        const professionIds = Object.keys(char.professions || {})
                            .map((id) => parseInt(id))
                            .filter((professionId) => !isSecondaryProfession[professionId]);

                        parts.push(
                            allAxis.indexOf('profession') >= 0 ? professionIds[0] || null : null
                        );
                        parts.push(
                            allAxis.indexOf('profession') >= 0 ? professionIds[1] || null : null
                        );

                        return parts;
                    })
                ).map(([key, characters]) => [key, sortBy(characters, (char) => -char.level)]),
                ([key]) => key
            )
        );

        // unique ID|display text?
        const combos: string[][] = [];

        for (let i = 0; i < 2; i++) {
            const axis = i === 0 ? sortedX : sortedY;

            if (axis.indexOf('realm') >= 0) {
                combos.push(
                    realms.map(
                        ([region, displayText, realm]) =>
                            `${realm.connectedRealmId}|[${region}] ${displayText}`
                    )
                );
            } else {
                combos.push(['']);
            }

            if (axis.indexOf('account') >= 0) {
                combos.push(
                    sortBy(
                        Object.values($userStore.accounts)
                            .filter(
                                (account) => settingsState.value.accounts?.[account.id]?.enabled
                            )
                            .map((account) => {
                                const tag =
                                    settingsState.value.accounts?.[account.id].tag || account.id;
                                return `${tag}|${tag}`;
                            }),
                        (key) => key.split('|')[0]
                    )
                );
            } else {
                combos.push(['']);
            }

            if (axis.indexOf('faction') >= 0) {
                combos.push(
                    [':alliance:', ':horde:'].map((faction, index) => `${index}|${faction}`)
                );
            } else {
                combos.push(['']);
            }

            if (axis.indexOf('gender') >= 0) {
                combos.push(genderValues.map((gender) => `${gender}|${Gender[parseInt(gender)]}`));
            } else {
                combos.push(['']);
            }

            if (axis.indexOf('race') >= 0) {
                combos.push(
                    [...wowthingData.static.characterRaceById.keys()].map(
                        (raceId) => `${raceId}|:race-${raceId}:`
                    )
                );
            } else {
                combos.push(['']);
            }

            if (axis.indexOf('class') >= 0) {
                combos.push(classOrder.map((classId) => `${classId}|:class-${classId}:`));
            } else {
                combos.push(['']);
            }

            if (axis.indexOf('profession') >= 0) {
                combos.push(
                    professionOrder.map(
                        (professionId) => `${professionId}|:profession-${professionId}:`
                    )
                );
            } else {
                combos.push(['']);
            }
        }

        xEntries = [];
        xKeys = [];
        yEntries = [];
        yKeys = [];

        const products = cartesianProduct(...combos);

        for (const product of products) {
            const xParts = product.slice(0, product.length / 2);
            const yParts = product.slice(product.length / 2, product.length);

            // console.log(xParts, yParts)

            if (xParts.length > 0) {
                const xSplit = xParts.map((s) => s.split('|'));

                const xKey = xSplit.map((parts) => parts[0]).join(',');
                if (!xKeys.some((key) => key === xKey)) {
                    xKeys.push(xKey);
                }

                const xEntry = xSplit.map((parts) => parts[1] || '').filter((x) => x !== '');
                if (!xEntries.some((entry) => xor(entry, xEntry).length === 0)) {
                    xEntries.push(xEntry);
                }
            }
            if (yParts.length > 0) {
                const ySplit = yParts.map((s) => s.split('|'));

                const yKey = ySplit.map((parts) => parts[0]).join(',');
                if (!yKeys.some((key) => key === yKey)) {
                    yKeys.push(yKey);
                }

                const yEntry = ySplit.map((parts) => parts[1] || '').filter((y) => y !== '');
                if (!yEntries.some((entry) => xor(entry, yEntry).length === 0)) {
                    yEntries.push(yEntry);
                }
            }
        }

        // console.log('x', xKeys, xEntries)
        // console.log('y', yKeys, yEntries)

        if (xEntries.length === 1 && !xEntries[0].some((x) => x !== '')) {
            xEntries[0] = ['All'];
            //xKeys.push('')
        }

        if (yEntries.length === 1 && !yEntries[0].some((y) => y !== '')) {
            yEntries[0] = ['All'];
        }

        // Counts
        xCounts = {};
        yCounts = {};
        for (const yKey of yKeys) {
            for (const xKey of xKeys) {
                const keyCharacters = getCharacters(xKey, yKey);
                xCounts[xKey] = (xCounts[xKey] || 0) + keyCharacters.length;
                yCounts[yKey] = (yCounts[yKey] || 0) + keyCharacters.length;
            }
        }
    }

    const axisOptions: [string, string][] = [
        ['account', 'Account'],
        ['faction', 'Faction'],
        ['realm', 'Realm'],
        ['class', 'Class'],
        ['gender', 'Gender'],
        ['race', 'Race'],
        ['profession', 'Profession'],
    ];
    const axisOrder = axisOptions.map(([key]) => key);

    // const mergeKeys = (xKey: string, yKey: string): string => {
    //     const xParts = xKey.split(',')
    //     const yParts = yKey.split(',')
    //     for (let index = 0; index < xParts.length; index++) {
    //         if (yParts[index]) {
    //             xParts[index] = yParts[index]
    //         }
    //     }
    //     return xParts.join(',')
    // }

    const regexCache: Record<string, RegExp> = {};
    const getCharacters = (xKey: string, yKey: string): Character[] => {
        // merge the keys into a single string
        const xParts = xKey.split(',');
        const yParts = yKey.split(',');
        for (let index = 0; index < xParts.length; index++) {
            if (yParts[index]) {
                xParts[index] = yParts[index];
            }
        }

        // professions, oof
        if (xParts[xParts.length - 1]) {
            const re1 = [...xParts, '\\d*'].join(',');
            const re2 = [...xParts.slice(0, -1), '\\d*', xParts[xParts.length - 1]].join(',');

            const match1 = (regexCache[re1] ||= new RegExp(re1));
            const match2 = (regexCache[re2] ||= new RegExp(re2));

            const characters: Character[] = [];
            for (const key in matrix) {
                if (key.match(match1) || key.match(match2)) {
                    characters.push(...matrix[key]);
                }
            }
            return characters;
        } else {
            xParts.push('');
            return matrix[xParts.join(',')] || [];
        }
    };
</script>

<style lang="scss">
    .wrapper {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        //width: 100%;
    }
    .options-wrapper {
        display: flex;
        gap: 0.5rem 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
    }
    .options-container {
        margin-bottom: 0;
        padding: 0.2rem 0.3rem;

        :global(input) {
            margin-top: 0;
            padding-bottom: 0;
            padding-top: 0;
        }
    }
    table {
        --image-border-width: 1px;

        :global(td) {
            border-left: 1px solid $border-color;
            padding: 0.3rem 0.6rem 0.4rem 0.6rem;
            text-align: center;

            :global(span) {
                display: block;
                margin-top: 0.1rem;
            }
            /*:global(img) {
                transform: scale(1.2);
            }*/
        }
    }
    .empty {
        background: #{$body-background};
        border-right-width: 0 !important;
        border-top-width: 0 !important;
    }
    .counts {
        color: #44ffff;
    }
</style>

<div class="wrapper">
    <UnderConstruction />

    <div class="options-wrapper">
        <div class="options-container background-box">
            <span>X axis:</span>

            {#each axisOptions as [value, label]}
                <GroupedCheckbox
                    name="x_{value}"
                    disabled={browserState.current.matrix.yAxis.indexOf(value) >= 0 ||
                        (browserState.current.matrix.xAxis.indexOf(value) === -1 &&
                            browserState.current.matrix.xAxis.length >= 2)}
                    {value}
                    bind:bindGroup={browserState.current.matrix.xAxis}>{label}</GroupedCheckbox
                >
            {/each}
        </div>

        <div class="options-container background-box">
            <span>Y axis:</span>

            {#each axisOptions as [value, label]}
                <GroupedCheckbox
                    name="y_{value}"
                    disabled={browserState.current.matrix.xAxis.indexOf(value) >= 0 ||
                        (browserState.current.matrix.yAxis.indexOf(value) === -1 &&
                            browserState.current.matrix.yAxis.length >= 3)}
                    {value}
                    bind:bindGroup={browserState.current.matrix.yAxis}>{label}</GroupedCheckbox
                >
            {/each}
        </div>

        <div class="options-container background-box">
            <span>Level &gt;=</span>

            <NumberInput
                name="min_level"
                minValue={0}
                maxValue={Constants.characterMaxLevel}
                bind:value={browserState.current.matrix.minLevel}
            />
        </div>

        <div class="options-container background-box">
            Show as:&nbsp;
            <RadioGroup
                name="show_character_as"
                bind:value={browserState.current.matrix.showCharacterAs}
                options={[
                    ['level', 'Level'],
                    ['name', 'Name'],
                ]}
            />
        </div>

        <div class="options-container background-box">
            <CheckboxInput
                name="show_empty_rows"
                bind:value={browserState.current.matrix.showEmptyRows}
            >
                Show empty rows
            </CheckboxInput>
        </div>
    </div>

    <table class="table table-striped">
        <thead>
            <tr>
                <td></td>
                {#each xEntries as lines}
                    <td class="x-axis">
                        {#each lines as line}
                            <ParsedText text={line} />
                        {/each}
                    </td>
                {/each}
                <td class="empty"></td>
            </tr>
        </thead>
        <tbody>
            {#each yKeys as yKey, yIndex}
                {#if browserState.current.matrix.showEmptyRows || yCounts[yKey] > 0}
                    <Row
                        count={yCounts[yKey]}
                        {getCharacters}
                        {xKeys}
                        yEntries={yEntries[yIndex]}
                        {yKey}
                    />
                {/if}
            {/each}
            <tr>
                <td></td>
                {#each xKeys as xKey}
                    <td class="counts">{xCounts[xKey]}</td>
                {/each}
                <td>
                    {Object.values(xCounts).reduce((a, b) => a + b, 0)}
                </td>
            </tr>
        </tbody>
    </table>
</div>
