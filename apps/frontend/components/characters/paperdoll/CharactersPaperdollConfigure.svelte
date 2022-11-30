<script lang="ts">
    import BackgroundSelector from '@/components/common/BackgroundSelector.svelte'

    export let selected: number
</script>

<style lang="scss">
    .configure {
        margin-top: 2rem;
    }
</style>

<div class="configure">
    <BackgroundSelector
        bind:selected
        showDefault={true}
    />
</div>
