<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { iconStrings, imageStrings } from '@/data/icons'
    import { manualStore, staticStore } from '@/stores'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let cls: string = undefined
    export let dropShadow = false
    export let text: string

    let element: HTMLElement
    let html: string
    $: {
        html = text.replaceAll(/:([a-z0-9_-]+):/g, '<span data-string="$1"></span>')
        
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
            /\{price:(\d+)(?:\|(\d+))?\}/g,
            (_, amountString: string, currencyId: number) => {
                const amount = parseInt(amountString).toLocaleString()
                if (currencyId) {
                    if (currencyId > 1000000) {
                        const itemId = currencyId - 1000000
                        const item = $manualStore.data.shared.items[itemId]
                        if (item) {
                            return `${amount} <span data-icon="item/${itemId}"></span> ${item.name}`
                        }
                        else {
                            return `${amount} Item #${itemId}`
                        }
                    }
                    else {
                        const currency = $staticStore.data.currencies[currencyId]
                        if (currency) {
                            return `${amount} <span data-icon="currency/${currencyId}"></span> ${currency.name}`
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
    }

    afterUpdate(() => {
        const stringSpans = element.querySelectorAll('[data-string]')
        for (const span of stringSpans) {
            const dataString = span.getAttribute('data-string')

            if (iconStrings[dataString] || !imageStrings[dataString]) {
                new IconifyIcon({
                    target: span,
                    props: {
                        icon: iconStrings[dataString] || iconStrings.question,
                        scale: '0.9',
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

        const iconSpans = element.querySelectorAll('[data-icon]')
        for (const span of iconSpans) {
            new WowthingImage({
                target: span,
                props: {
                    border: 0,
                    name: span.getAttribute('data-icon'),
                    size: 16,
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
