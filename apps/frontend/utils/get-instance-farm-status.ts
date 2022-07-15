import type { FarmStatus, UserCount } from '@/types'
import type { JournalData, JournalDataInstance } from '@/types/data'
import type { ManualDataZoneMapFarm } from '@/types/data/manual'
import type { StaticData } from '@/types/data/static'


export function getInstanceFarmStatus(
    journalData: JournalData,
    staticData: StaticData,
    farm: ManualDataZoneMapFarm
): FarmStatus {
    const status: FarmStatus = {
        characters: [],
        drops: [],
        need: false,
    }

    let instance: JournalDataInstance
    for (const tier of journalData.tiers) {
        const instances = tier.instances.filter((instance) => instance.id === farm.id)
        if (instances.length > 0) {
            instance = instances[0]
            const stats = journalData.stats[`${tier.slug}--${instance.slug}`]
            status.link = `${tier.slug}/${instance.slug}`
            status.need = stats.have < stats.total
            break
        }
    }

    return status
}
