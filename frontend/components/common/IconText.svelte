<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { iconStrings } from '@/data/icons'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let dropShadow = false
    export let text: string

    let element: HTMLElement
    let html: string
    $: {
        html = text.replaceAll(/:(.*?):/g, '<span data-string="$1"></span>')
    }

    afterUpdate(() => {
        const spans = element.querySelectorAll('[data-string]')
        for (const span of spans) {
            const dataString = span.getAttribute('data-string')
            const icon = new IconifyIcon({
                target: span,
                props: {
                    icon: iconStrings[dataString],
                    scale: '0.9',
                    dropShadow,
                }
            })
        }
    })
</script>

<style lang="scss">
    span {
        display: inline-flex;

        :global(svg) {
            margin-top: -4px;
        }
    }
</style>

<span bind:this={element}>
    {@html html}
</span>
