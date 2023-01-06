import csv
import glob
import os
import os.path
import re
import sys


CLASS_MASK = {
       1: 'warrior',
       2: 'paladin',
       4: 'hunter',
       8: 'rogue',
      16: 'priest',
      32: 'death-knight',
      64: 'shaman',
     128: 'mage',
     256: 'warlock',
     512: 'monk',
    1024: 'druid',
    2048: 'demon-hunter',
}

ARMOR_NAME = {
    'death-knight': 'Dreadplate',
    'demon-hunter': 'Felskin',
    'druid': 'Dragonhide',
    'hunter': 'Chain',
    'mage': 'Silk',
    'monk': 'Ironskin',
    'paladin': 'Scaled',
    'priest': 'Satin',
    'rogue': 'Leather',
    'shaman': 'Ringmail',
    'warlock': 'Felweave',
    'warrior': 'Plate',
}

SLOT_MAP = {
     1: 'Head',
     3: 'Shoulders',
     5: 'Chest',
     6: 'Waist',
     7: 'Legs',
     8: 'Feet',
     9: 'Wrists',
    10: 'Hands',
    16: 'Back',
    20: 'Chest',
}

SLOT_ORDER = [
    1,
    3,
    16,
    5,
    20,
    9,
    10,
    6,
    7,
    8,
]


def main():
    dumps_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'dumps')

    inds = set()
    if len(sys.argv) == 3:
        ind = sys.argv[2].lower()
        with open(glob.glob(os.path.join(dumps_path, 'enUS', 'itemnamedescription-*.csv'))[0]) as csv_file:
            for row in csv.DictReader(csv_file):
                if row['Description_lang'].lower() == ind:
                    inds.add(int(row['ID']))
                    print(row['ID'], '->', row['Description_lang'])

    items = []
    item_prefix = sys.argv[1].lower()
    with open(glob.glob(os.path.join(dumps_path, 'enUS', 'itemsparse-*.csv'))[0]) as csv_file:
        # ID,AllowableRace,Description_lang,Display3_lang,Display2_lang,Display1_lang,Display_lang,
        # ExpansionID,DmgVariance,LimitCategory,DurationInInventory,QualityModifier,BagFamily,
        # StartQuestID,LanguageID,ItemRange,StatPercentageOfSocket[0-9],StatPercentEditor[0-9],
        # Stackable,MaxCount,RequiredAbility,SellPrice,BuyPrice,VendorStackCount,PriceVariance,
        # PriceRandomValue,Flags[0],Flags[1],Flags[2],Flags[3],OppositeFactionItemID,
        # ModifiedCraftingReagentItemID,ContentTuningID,PlayerLevelToItemLevelCurveID,
        # ItemNameDescriptionID,RequiredTransmogHoliday,RequiredHoliday,Gem_properties,
        # Socket_match_enchantment_ID,TotemCategoryID,InstanceBound,ZoneBound[0],ZoneBound[1],
        # ItemSet,LockID,PageID,ItemDelay,MinFactionID,RequiredSkillRank,RequiredSkill,ItemLevel,
        # AllowableClass,ArtifactID,SpellWeight,SpellWeightCategory,SocketType[0-3],SheatheType,
        # Material,PageMaterialID,Bonding,DamageType,StatModifier_bonusStat[0-9],ContainerSlots,
        # MinReputation,RequiredPVPMedal,RequiredPVPRank,RequiredLevel,InventoryType,OverallQualityID
        for row in csv.DictReader(csv_file):
            if not row['Display_lang'].lower().startswith(item_prefix):
                continue
                
            if len(inds) > 0 and int(row['ItemNameDescriptionID']) not in inds:
                print(row['ItemNameDescriptionID'])
                continue
            
            items.append(row)

    grouped = {}
    for item in items:
        class_mask = int(item['AllowableClass'])
        if class_mask not in CLASS_MASK:
            #print('mask?', mask)
            continue

        faction = -1
        race_mask = int(item['AllowableRace'])
        if (race_mask & 0x1) > 0:
            faction = 0
        elif (race_mask & 0x2) > 0:
            faction = 1
        
        grouped.setdefault((faction, CLASS_MASK[class_mask]), []).append(item)
    
    for (faction, cls), items in sorted(grouped.items()):
        prefix = items[0]['Display_lang'].split("'s ")[0]
        name = f"{prefix}'s {ARMOR_NAME[cls]} Armor"

        print()
        print(f'  - name: "{name}" # {["Alliance", "Horde", "???"][faction]}')
        print(f'    tags:')
        print(f'      - "class:{cls}"')
        print(f'    items:')

        items.sort(key=lambda x: SLOT_ORDER.index(int(x['InventoryType'])))
        for item in items:
            print(f'      - {item["ID"]} # {SLOT_MAP[int(item["InventoryType"])]}')

if __name__ == '__main__':
    main()
