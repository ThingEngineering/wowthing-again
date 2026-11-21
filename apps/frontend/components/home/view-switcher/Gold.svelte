<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { userState } from '@/user-home/state/user';

    let totalGold = $derived(
        (
            userState.general.warbankGold +
            userState.general.characters.map((char) => char.gold || 0).reduce((a, b) => a + b, 0)
        ).toLocaleString()
    );
    let warbankGold = $derived(userState.general.warbankGold.toLocaleString());
</script>

<style lang="scss">
    .account-gold {
        --border-color: #7f7;

        cursor: pointer;
    }
</style>

<div class="flex-wrapper">
    <button
        class="account-gold"
        data-tooltip="Click to toggle between Warbank and Total gold"
        onclick={() =>
            (browserState.current.home.showTotalGold = !browserState.current.home.showTotalGold)}
    >
        {#if browserState.current.home.showTotalGold}
            Total: {totalGold} g
        {:else}
            Warbank: {warbankGold} g
        {/if}
    </button>
</div>
