<script lang="ts">
    import { afterUpdate, mount } from 'svelte';

    import { iconStrings, imageStrings } from '@/data/icons';
    import { Faction } from '@/enums/faction';
    import { RewardReputation } from '@/enums/reward-reputation';
    import { iconLibrary, aliasedIcons, uiIcons } from '@/shared/icons';
    import { wowthingData } from '@/shared/stores/data';
    import { parsedTextStore } from '@/stores';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';
    import RaceIcon from '@/shared/components/images/RaceIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
    import { getGenderedName } from '@/utils/get-gendered-name';

    export let cls: string = undefined;
    export let dropShadow = false;
    export let text: string;

    let element: HTMLElement;
    let html: string;
    $: {
        if (text && $parsedTextStore[text]) {
            html = $parsedTextStore[text];
            break $;
        }

        html = text || '';

        html = html.replace(
            /(- )?\|A:Professions-ChatIcon-Quality-Tier(\d):20:20\|a/,
            '{craftedQuality:$2}'
        );

        // {faction:factionId}
        html = html.replaceAll(/\{faction:(\d+)\}/g, (_, factionIdString: string) => {
            const factionId = parseInt(factionIdString);
            const rep = wowthingData.static.reputationById.get(factionId);
            return rep?.name || `Faction #${factionId}`;
        });

        // {reputation:amount|factionId}
        html = html.replaceAll(
            /\{reputation:(\d+)\|(\d+)\}/g,
            (_, amount: number, repId: number) => {
                const parts: string[] = [];
                if (amount > 0) {
                    parts.push(amount.toString());
                    parts.push('rep with');
                }
                parts.push(
                    wowthingData.static.reputationById.get(repId)?.name ?? `Reputation #${repId}`
                );
                return parts.join(' ');
            }
        );

        html = html.replaceAll(
            /\{repPrice:(\d+)\|(\d+)\|(\d+)(?:\|([-\d]+))?\}/g,
            (
                _,
                repIdString: string,
                repLevel: number,
                amount: number,
                currencyIdString: string
            ) => {
                const parts: string[] = [];

                const currencyId = parseInt(currencyIdString);
                const repId = parseInt(repIdString);

                const rep = wowthingData.static.reputationById.get(repId);

                if (currencyId) {
                    parts.push(`{price:${amount}|${Math.abs(currencyId)}}`);
                } else {
                    parts.push(`{price:${amount}}`);
                }

                parts.push('at');
                if (rep?.renownCurrencyId) {
                    parts.push(`Renown ${repLevel}`);
                } else {
                    console.log(
                        repId,
                        typeof repId,
                        repLevel,
                        amount,
                        currencyId,
                        rep,
                        RewardReputation[repLevel]
                    );
                    parts.push(RewardReputation[repLevel].split(/(?=[A-Z])|(?=[0-9])/).join(' '));
                }

                if ((currencyId || 0) >= 0) {
                    parts.push('with');
                    parts.push(rep?.name ?? `Reputation #${repId}`);
                }

                return parts.join(' ');
            }
        );

        // {currency:currencyId}
        html = html.replaceAll(/\{currency:(\d+)\}/g, (_, currencyIdString: string) => {
            const currency = wowthingData.static.currencyById.get(parseInt(currencyIdString));
            return `<span data-icon="currency/${currencyIdString}"></span> ${currency?.name || `Currency #${currencyIdString}`}`;
        });

        // {price:amount} or {price:amount|currencyId}
        html = html.replaceAll(
            /\{price(Short)?:(\d+)(?:\|(\d+))?\}/g,
            (_, short: string, amountString: string, currencyIdString: string) => {
                const amount = parseInt(amountString).toLocaleString();
                if (currencyIdString) {
                    const currencyId = parseInt(currencyIdString);
                    if (currencyId > 1000000) {
                        const itemId = currencyId - 1000000;
                        const item = wowthingData.items.items[itemId];
                        if (item) {
                            if (short !== undefined) {
                                return `<span data-icon="item/${itemId}"></span> ${amount}`;
                            } else {
                                return `${amount}x <span data-icon="item/${itemId}"></span> ${item.name}`;
                            }
                        } else {
                            return `${amount}x Item #${itemId}`;
                        }
                    } else {
                        const currency = wowthingData.static.currencyById.get(currencyId);
                        if (currency) {
                            if (short !== undefined) {
                                return `<span data-icon="currency/${currencyId}"></span> ${amount}`;
                            } else {
                                return `${amount}x <span data-icon="currency/${currencyId}"></span> ${currency.name}`;
                            }
                        } else {
                            return `${amount}x Currency #${currencyId}`;
                        }
                    }
                } else {
                    return `${amount}g`;
                }
            }
        );

        // {image:path}
        html = html.replaceAll(/\{image:(.*?)\}/g, (_, imagePath) => {
            return `<span data-icon="${imagePath}"></span>`;
        });

        // {itemWithIcon:id}
        html = html.replaceAll(/\{itemWithIcon:(\d+)\}/g, (_, itemId) => {
            const item = wowthingData.items.items[parseInt(itemId)];
            if (item) {
                return `<span data-icon="item/${itemId}"></span> <span class="quality${item.quality}">${item.name}</span>`;
            }
        });

        // {item:id}
        html = html.replaceAll(/\{item:(\d+)\}/g, (_, itemId) => {
            const item = wowthingData.items.items[parseInt(itemId)];
            if (item) {
                if (item.craftingQuality) {
                    return `<span class="quality${item.quality}">${item.name} <span data-crafted-quality="${item.craftingQuality}"></span></span>`;
                } else {
                    return `<span class="quality${item.quality}">${item.name}</span>`;
                }
            } else {
                return `<span class="quality1">Item #${itemId}`;
            }
        });

        html = html.replaceAll(
            /\{color:([A-Z0-9]+)(?::([A-Z0-9]+))?\}/g,
            (_, hex1: string, hex2: string) => {
                if (hex2) {
                    return `
<div class="flex-wrapper drop-shadow" style="height: 16px; width:48px;">
<div style="height: 16px; width: 24px; background-color: #${hex1}; border: 1px solid #888;"></div>
<div style="height: 16px; width: 24px; background-color: #${hex2}; border: 1px solid #888; border-left-width: 0;"></div>
</div>
`;
                } else {
                    return `
<div class="drop-shadow" style="height: 16px; width: 48px; background-color: #${hex1}; border: 1px solid #888;"></div>
`;
                }
            }
        );

        html = html.replaceAll(
            /\{craftedQuality:(\d+)\}/g,
            '<span data-crafted-quality="$1"></span>'
        );

        html = html.replaceAll(/:classMask-(\d+):/g, (_, classMaskString) => {
            const classMask = parseInt(classMaskString);
            const classId =
                classMask in PlayableClassMask
                    ? PlayableClass[PlayableClassMask[classMask] as keyof typeof PlayableClass]
                    : 0;
            return `${getGenderedName(wowthingData.static.characterClassById.get(classId)?.name)}`;
        });

        html = html.replaceAll(/:class-(\d+):/g, '<span data-class="$1"></span>');
        html = html.replaceAll(/:(alliance|horde):/g, '<span data-faction="$1"></span>');
        html = html.replaceAll(/:profession-(\d+):/g, '<span data-profession="$1"></span>');
        html = html.replaceAll(/:race-(\d+):/g, '<span data-race="$1"></span>');

        html = html.replaceAll(/:quality-(\d+)-(.*?):/g, '<span class="quality$1">$2</span>');

        // :foo: icon strings
        html = html.replaceAll(/:([a-zA-Z0-9_-]+):/g, '<span data-string="$1"></span>');

        // Square brackets => code
        html = html.replaceAll(/(\[(.*?)\])/g, '<code>$1</code>');

        if (text) {
            $parsedTextStore[text] = html;
        }
    }

    afterUpdate(() => {
        if (!element) {
            return;
        }
        for (const span of element.querySelectorAll('span')) {
            if (span.hasAttribute('data-string')) {
                span.replaceChildren();
                const dataString = span.getAttribute('data-string');

                const aliasedMaybe = aliasedIcons[dataString as keyof typeof aliasedIcons];
                const libraryMaybe = iconLibrary[dataString as keyof typeof iconLibrary];
                const uiIconMaybe = uiIcons[dataString as keyof typeof uiIcons];
                if (
                    libraryMaybe ||
                    aliasedMaybe ||
                    uiIconMaybe ||
                    iconStrings[dataString] ||
                    !imageStrings[dataString]
                ) {
                    mount(IconifyIcon, {
                        target: span,
                        props: {
                            icon:
                                uiIconMaybe ||
                                aliasedMaybe ||
                                libraryMaybe ||
                                iconStrings[dataString] ||
                                iconStrings.question,
                            scale: '0.75',
                            dropShadow,
                        },
                    });
                } else {
                    mount(WowthingImage, {
                        target: span,
                        props: {
                            border: 0,
                            name: imageStrings[dataString],
                            size: 16,
                        },
                    });
                }
            } else if (span.hasAttribute('data-icon')) {
                span.replaceChildren();
                mount(WowthingImage, {
                    target: span,
                    props: {
                        border: 0,
                        name: span.getAttribute('data-icon'),
                        size: 16,
                    },
                });
            } else if (span.hasAttribute('data-class')) {
                span.replaceChildren();
                mount(ClassIcon, {
                    target: span,
                    props: {
                        classId: parseInt(span.getAttribute('data-class')),
                        size: 16,
                    },
                });
            } else if (span.hasAttribute('data-faction')) {
                span.replaceChildren();
                mount(FactionIcon, {
                    target: span,
                    props: {
                        faction:
                            span.getAttribute('data-faction') === 'alliance'
                                ? Faction.Alliance
                                : Faction.Horde,
                        size: 16,
                    },
                });
            } else if (span.hasAttribute('data-profession')) {
                span.replaceChildren();
                mount(ProfessionIcon, {
                    target: span,
                    props: {
                        id: parseInt(span.getAttribute('data-profession')),
                        size: 16,
                    },
                });
            } else if (span.hasAttribute('data-race')) {
                span.replaceChildren();
                mount(RaceIcon, {
                    target: span,
                    props: {
                        raceId: parseInt(span.getAttribute('data-race')),
                        size: 16,
                    },
                });
            } else if (span.hasAttribute('data-crafted-quality')) {
                span.replaceChildren();
                mount(CraftedQualityIcon, {
                    target: span,
                    props: {
                        quality: parseInt(span.getAttribute('data-crafted-quality')),
                    },
                });
            }
        }
    });
</script>

<style lang="scss">
    span {
        --image-border-width: 1px;
        --image-margin-top: -4px;
    }
</style>

<span bind:this={element} class={cls}>
    {@html html}
</span>
