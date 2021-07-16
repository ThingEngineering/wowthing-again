<script lang="ts">
    import AchievementsAchievement from './AchievementsAchievement.svelte'

    const achievements = ['pants', 'pants', 'revolution']
</script>

<style lang="scss">
    div {
        width: 100%;
    }
</style>

<div>
    <h2>Recent</h2>
    {#each achievements as achievement}
        <AchievementsAchievement {achievement} />
    {/each}
</div>
