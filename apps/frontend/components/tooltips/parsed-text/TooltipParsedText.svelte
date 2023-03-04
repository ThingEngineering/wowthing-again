<script lang="ts">
    import ParsedText from '@/components/common/ParsedText.svelte'

    export let content: string
</script>

<ParsedText text={content} />
