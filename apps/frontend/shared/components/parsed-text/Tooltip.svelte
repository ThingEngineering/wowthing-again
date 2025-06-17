<script lang="ts">
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    let { content }: { content: string } = $props();
</script>

<ParsedText text={content} />
