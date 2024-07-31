import type { UserAuctionDataPet } from '@/types/data'
import { ItemLocation } from '@/enums/item-location'
import { getCharacterNameRealm } from '@/utils/get-character-name-realm'

export default function petLocationTooltip(pet: UserAuctionDataPet): string {
    if (pet.location === ItemLocation.PetCollection) {
        return 'Pet collection'
    }
    else if (pet.location === ItemLocation.Bags) {
        return 'Bags: ' + getCharacterNameRealm(pet.locationId)
    }
    else if (pet.location === ItemLocation.Bank) {
        return 'Bank: ' + getCharacterNameRealm(pet.locationId)
    }
    else if (pet.location === ItemLocation.GuildBank) {
        return 'Guild Bank: ???, Tab ' + pet.locationId
    }
    else {
        return '?????'
    }
}
