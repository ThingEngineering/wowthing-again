<script lang="ts">
    export let reputation
</script>

<th class:split={reputation.Both}>
    {#if reputation.Both}
        <img src="both" width="36" height="36">
    {:else}
        <img src="one" width="36" height="36">
    {/if}
</th>
