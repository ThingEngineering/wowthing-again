<script lang="ts">
    import { data as staticData } from '../../stores/static-store'
    import { data as userData } from '../../stores/user-store'

    /*
     MountToSpell = { mountID : spellID }
     MountSets = [
        {
            Name: "" (null for first)
            Groups: [
                {
                    Name: "Things"
                    Things: [
                        [1, 2] (mountIDs)
                    ]
                }
            ]
        }
    ]
     */

    import Collection from './Collection.svelte'
</script>

<Collection thingType="spell" thingMap={$staticData.MountToSpell} userHas={$userData.mounts} sets={$staticData.MountSets} />
