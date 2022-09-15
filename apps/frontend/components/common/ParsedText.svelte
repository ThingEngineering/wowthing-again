<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { iconStrings, imageStrings } from '@/data/icons'
    import { itemStore, staticStore } from '@/stores'

    import ClassIcon from '../images/ClassIcon.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let cls: string = undefined
    export let dropShadow = false
    export let text: string

    let element: HTMLElement
    let html: string
    $: {
        html = text || ''

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
                parts.push(['??', 'Friendly', 'Honored', 'Revered', 'Exalted'][repLevel])
                parts.push('with')

                parts.push($staticStore.data.reputations[repId]?.name ?? `Reputation #${repId}`)

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
                        const item = $itemStore.data.items[itemId]
                        if (item) {
                            if (short !== undefined) {
                                return `<span data-icon="item/${itemId}"></span> ${amount}`
                            }
                            else {
                                return `${amount} <span data-icon="item/${itemId}"></span> ${item.name}`
                            }
                        }
                        else {
                            return `${amount} Item #${itemId}`
                        }
                    }
                    else {
                        const currency = $staticStore.data.currencies[currencyId]
                        if (currency) {
                            if (short !== undefined) {
                                return `<span data-icon="currency/${currencyId}"></span> ${amount}`
                            }
                            else {
                                return `${amount} <span data-icon="currency/${currencyId}"></span> ${currency.name}`
                            }
                        }
                        else {
                            return `${amount} Currency #${currencyId}`
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
            (_, itemId) => $itemStore.data.items[parseInt(itemId)]?.name || `Item #${itemId}`
        )

        html = html.replaceAll(/:class-(\d+):/g, '<span data-class="$1"></span>')
        html = html.replaceAll(/:race-(\d+):/g, '<span data-race="$1"></span>')

        // :foo: icon strings
        html = html.replaceAll(/:([a-z0-9_-]+):/g, '<span data-string="$1"></span>')
    }

    afterUpdate(() => {
        for (const span of element.querySelectorAll('[data-string]')) {
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
                        size: 20,
                    }
                })
            }
        }

        for (const span of element.querySelectorAll('[data-icon]')) {
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

        for (const span of element.querySelectorAll('[data-class]')) {
            span.replaceChildren()
            new ClassIcon({
                target: span,
                props: {
                    classId: parseInt(span.getAttribute('data-class'))
                }
            })
        }
        
        for (const span of element.querySelectorAll('[data-race]')) {
            span.replaceChildren()
            new RaceIcon({
                target: span,
                props: {
                    raceId: parseInt(span.getAttribute('data-race'))
                }
            })
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
