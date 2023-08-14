<script lang="ts">
    import type { Character } from '@/types'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import RaceIcon from '@/components/images/RaceIcon.svelte'

    export let character: Character
</script>

<style lang="scss">
    .info {
        --image-border-width: 2px;

        margin-top: 0.5rem;
        padding: 0.3wrem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{character.realm.name}</h5>
    <div class="info">
        <div class="faction{character.faction}">
            <RaceIcon
                border={2}
                size={32}
                {character}
            />
            <ClassIcon
                border={1}
                size={32}
                {character}
            />
        </div>
        <div>Level {character.level}</div>
    </div>
</div>
