<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { iconStrings, imageStrings } from '@/data/icons'
    import { Faction } from '@/enums/faction'
    import { RewardReputation } from '@/enums/reward-reputation'
    import { itemStore, parsedTextStore } from '@/stores'
    import { staticStore } from '@/stores/static'

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte'
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte'
    import RaceIcon from '@/shared/components/images/RaceIcon.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let cls: string = undefined
    export let dropShadow = false
    export let text: string

    let element: HTMLElement
    let html: string
    $: {
        if (text && $parsedTextStore[text]) {
            html = $parsedTextStore[text]
            break $
        }

        html = text || ''

        html = html.replace(/(- )?\|A:Professions-ChatIcon-Quality-Tier(\d):20:20\|a/, '{craftedQuality:$2}')

        // {reputation:amount|factionId}
        html = html.replaceAll(
            /\{reputation:(\d+)\|(\d+)\}/g,
            (_, amount: number, repId: number) => {
                const parts: string[] = []
                parts.push(amount.toString())
                parts.push('rep with')
                parts.push($staticStore.reputations[repId]?.name ?? `Reputation #${repId}`)
                return parts.join(' ')
            }
        )

        html = html.replaceAll(
            /\{repPrice:(\d+)\|(\d+)\|(\d+)(?:\|(\d+))?\}/g,
            (_, repId: number, repLevel: number, amount: number, currencyId: number) => {
                const parts: string[] = []
                if (currencyId) {
                    parts.push(`{price:${amount}|${currencyId}}`)
                }
                else {
                    parts.push(`{price:${amount}}`)
                }
                
                parts.push('at')
                parts.push(RewardReputation[repLevel]
                    .split(/(?=[A-Z])|(?=[0-9])/)
                    .join(' ')
                )
                parts.push('with')

                parts.push($staticStore.reputations[repId]?.name ?? `Reputation #${repId}`)

                return parts.join(' ')
            }
        )

        // {price:amount} or {price:amount|currencyId}
        html = html.replaceAll(
            /\{price(Short)?:(\d+)(?:\|(\d+))?\}/g,
            (_, short: string, amountString: string, currencyId: number) => {
                const amount = parseInt(amountString).toLocaleString()
                if (currencyId) {
                    if (currencyId > 1000000) {
                        const itemId = currencyId - 1000000
                        const item = $itemStore.items[itemId]
                        if (item) {
                            if (short !== undefined) {
                                return `<span data-icon="item/${itemId}"></span> ${amount}`
                            }
                            else {
                                return `${amount}x <span data-icon="item/${itemId}"></span> ${item.name}`
                            }
                        }
                        else {
                            return `${amount}x Item #${itemId}`
                        }
                    }
                    else {
                        const currency = $staticStore.currencies[currencyId]
                        if (currency) {
                            if (short !== undefined) {
                                return `<span data-icon="currency/${currencyId}"></span> ${amount}`
                            }
                            else {
                                return `${amount}x <span data-icon="currency/${currencyId}"></span> ${currency.name}`
                            }
                        }
                        else {
                            return `${amount}x Currency #${currencyId}`
                        }
                    }
                }
                else {
                    return `${amount}g`
                }
            }
        )

        // {item:id}
        html = html.replaceAll(
            /\{item:(\d+)\}/g,
            (_, itemId) => {
                const item = $itemStore.items[parseInt(itemId)]
                return `<span class="quality${item?.quality || 0}">${item?.name || `Item #${itemId}`}</span>`
            }
        )

        html = html.replaceAll(/\{craftedQuality:(\d+)\}/g, '<span data-crafted-quality="$1"></span>')

        html = html.replaceAll(/:class-(\d+):/g, '<span data-class="$1"></span>')
        html = html.replaceAll(/:(alliance|horde):/g, '<span data-faction="$1"></span>')
        html = html.replaceAll(/:profession-(\d+):/g, '<span data-profession="$1"></span>')
        html = html.replaceAll(/:race-(\d+):/g, '<span data-race="$1"></span>')

        html = html.replaceAll(/:quality-(\d+)-(.*?):/g, '<span class="quality$1">$2</span>')

        // :foo: icon strings
        html = html.replaceAll(/:([a-zA-Z0-9_-]+):/g, '<span data-string="$1"></span>')

        // Square brackets => code
        html = html.replaceAll(/(\[(.*?)\])/g, '<code>$1</code>')

        if (text) {
            $parsedTextStore[text] = html
        }
    }

    afterUpdate(() => {
        for (const span of element.querySelectorAll('span')) {
            if (span.hasAttribute('data-string')) {
                span.replaceChildren()
                const dataString = span.getAttribute('data-string')

                if (iconStrings[dataString] || !imageStrings[dataString]) {
                    new IconifyIcon({
                        target: span,
                        props: {
                            icon: iconStrings[dataString] || iconStrings.question,
                            scale: '0.75',
                            dropShadow,
                        }
                    })
                }
                else {
                    new WowthingImage({
                        target: span,
                        props: {
                            border: 0,
                            name: imageStrings[dataString],
                            size: 16,
                        }
                    })
                }
            }

            else if (span.hasAttribute('data-icon')) {
                span.replaceChildren()
                new WowthingImage({
                    target: span,
                    props: {
                        border: 0,
                        name: span.getAttribute('data-icon'),
                        size: 16,
                    }
                })
            }

            else if (span.hasAttribute('data-class')) {
                span.replaceChildren()
                new ClassIcon({
                    target: span,
                    props: {
                        classId: parseInt(span.getAttribute('data-class')),
                        size: 16,
                    }
                })
            }

            else if (span.hasAttribute('data-faction')) {
                span.replaceChildren()
                new FactionIcon({
                    target: span,
                    props: {
                        faction: span.getAttribute('data-faction') === 'alliance'
                            ? Faction.Alliance
                            : Faction.Horde,
                        size: 16,
                    }
                })
            }

            else if (span.hasAttribute('data-profession')) {
                span.replaceChildren()
                new ProfessionIcon({
                    target: span,
                    props: {
                        id: parseInt(span.getAttribute('data-profession')),
                        size: 16,
                    }
                })
            }
            
            else if (span.hasAttribute('data-race')) {
                span.replaceChildren()
                new RaceIcon({
                    target: span,
                    props: {
                        raceId: parseInt(span.getAttribute('data-race')),
                        size: 16,
                    }
                })
            }

            else if (span.hasAttribute('data-crafted-quality')) {
                span.replaceChildren()
                new CraftedQualityIcon({
                    target: span,
                    props: {
                        quality: parseInt(span.getAttribute('data-crafted-quality')),
                    }
                })
            }
        }
    })
</script>

<style lang="scss">
    span {
        --image-margin-top: -4px;
    }
</style>

<span
    bind:this={element}
    class={cls}
>
    {@html html}
</span>
