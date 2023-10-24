<script lang="ts">
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'

    export let content: string
</script>

<ParsedText text={content} />
