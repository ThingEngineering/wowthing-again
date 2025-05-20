<script lang="ts">
    import GuildBank from './GuildBank.svelte';
    import Sidebar from './Sidebar.svelte';

    export let slug1: string;
    export let slug2: string;
</script>

<div class="view">
    <Sidebar />
    {#if slug1}
        <GuildBank {slug1} {slug2} />
    {/if}
</div>
