import csv
import glob
import os
import os.path
import re
import sys

#map.nodes[11905220] = Rare({
#    id=142436,
#    quest={53016, 53522},
#    controllingFaction='Horde',
#    rewards={
#        Pet({item=163689, id=2437})
#    }
#}) -- Ragebeak


TYPE_ORDER = dict(
    item=0,
    mount=1,
    pet=2,
    toy=3,
    transmog=4,
    quest=5,
)


class CsvReader:
    base_path = os.path.join(os.path.abspath(os.path.expanduser(os.environ['WOWTHING_DUMP_PATH'])), 'enUS')

    def __init__(self, filename):
        self.filename = filename + '.csv'
    
    def __enter__(self):
        self.file = open(os.path.join(self.base_path, self.filename))
        return csv.DictReader(self.file)
    
    def __exit__(self, exc_type, exc_value, traceback):
        self.file.close()


def main():
    creature_map = {}
    with CsvReader('creature') as reader:
        for row in reader:
            creature_map[int(row['ID'])] = row['Name_lang']

    mount_map = {}
    with CsvReader('mount') as reader:
        for row in reader:
            mount_map[int(row['ID'])] = dict(
                name=row['Name_lang'],
                spell_id=int(row['SourceSpellID']),
            )

    pet_map = {}
    with CsvReader('battlepetspecies') as reader:
        for row in reader:
            pet_map[int(row['ID'])] = dict(
                creature_id=int(row['CreatureID']),
                spell_id=int(row['SummonSpellID']),
            )

    kills = []
    treasures = []

    line_number = 0
    state = None
    thing = None
    thing_type = ''

    for line in open(sys.argv[1]):
        line = line.strip()
        line_number += 1

        m = re.match(r'^map\.nodes\[(\d+)\]\s*=\s*(BonusBoss|Rare|Treasure)\(\{.*?$', line)
        if m:
            #function HandyNotes:getXY(id)
            #    return floor(id / 10000) / 10000, (id % 10000) / 10000
            #end

            coords = int(m.group(1))
            x = round(coords / 100000) / 10
            y = round(coords % 10000 / 10) / 10

            thing = dict(
                location=f'{x} {y}',
                rewards=[],
            )
            thing_type = m.group(2)
        
        elif thing is not None:
            if state and (line == '}' or line == '},'):
                state = None
                continue

            # Comments
            if line.startswith('--'):
                continue

            # Shrug
            if re.search(r'^(assault|controllingFaction|fgroup|future|glow|label|noassault|note|requires|rift|rlabel|vignette)\s*=', line):
                continue

            if re.search(r'^pois\s*=\s*\{', line) and not re.search(r'\}$', line) and not re.search('\}\s*--.*?$', line):
                state = 'pois'
                continue
            elif state == 'pois':
                continue

            if re.match(r'^rewards\s*=\s*{$', line):
                state = 'rewards'
                print('rewards')
                continue
            elif state == 'rewards':
                print('reward: ', line)
                if line.startswith('Achievement({'):
                    continue

                m = re.match(r'^Item\(\{(.*?)\}\),?\s*--\s*(.*?)$', line)
                if m:
                    keys = {}
                    for part in m.group(1).split(', '):
                        parts = re.split(r'\s*=\s*', part, 1)
                        keys[parts[0]] = parts[1]

                    if 'note' in keys and ('"neck"' in keys['note'] or '"ring"' in keys['note'] or '"trinket"' in keys['note']):
                        continue

                    if 'quest' in keys:
                        reward = dict(
                            type='quest',
                            id=keys['quest'],
                            name=m.group(2),
                        )

                        if 'covenant' in keys:
                            reward['limit'] = f'covenant {keys["covenant"].lower()}'

                        thing['rewards'].append(reward)
                        continue

                m = re.match(r'^Mount\(\{.*?id\s*=\s*(\d+).*?\}\).*?$', line)
                if m:
                    mount = mount_map[int(m.group(1))]

                    thing['rewards'].append(dict(
                        type='mount',
                        id=mount['spell_id'],
                        name=mount['name'],
                    ))
                    continue

                m = re.match(r'^Pet\(\{.*?id\s*=\s*(\d+).*?\}\).*?$', line)
                if m:
                    pet = pet_map[int(m.group(1))]
                    name = creature_map[pet['creature_id']]

                    thing['rewards'].append(dict(
                        type='pet',
                        id=m.group(1),
                        name=name,
                    ))
                    continue

                m = re.match(r'^Toy\(\{item\s*=\s*(\d+)\}\),?( -- (.*?))?$', line)
                if m:
                    print(m.groups())
                    thing['rewards'].append(dict(
                        type='toy',
                        id=m.group(1),
                        name=m.group(3),
                    ))
                    continue

                m = re.match(r'^Transmog\(\{(.*?)\}\),?\s*--\s*(.*?)$', line)
                if m:
                    keys = {}
                    for part in m.group(1).split(', '):
                        parts = re.split(r'\s*=\s*', part, 1)
                        keys[parts[0]] = parts[1]

                    if 'note' in keys and '"trinket"' in keys['note']:
                        continue

                    thing_data = dict(
                        type='transmog',
                        id=keys['item'],
                        name=m.group(2),
                    )

                    m2 = re.match(r'^L\[[\'"](.*?)[\'"]\]$', keys.get('slot', ''))
                    if m2:
                        slot = m2.group(1)
                        thing_data['name'] += f' [{m2.group(1)} ?]'

                    if 'covenant' in keys:
                        if 'limit' in thing_data:
                            thing_data['limit'] += f' covenant {keys["covenant"].lower()}'
                        else:
                            thing_data['limit'] = f'covenant {keys["covenant"].lower()}'

                    thing['rewards'].append(thing_data)
                    continue

                matches = re.findall(r'DC\.(\w+)\.(\w+)\b', line)
                if matches:
                    print(matches)
                    found_any = False

                    for dragon_parts in matches:
                        if dragon_parts[0] in dragonriding and dragon_parts[1] in dragonriding[dragon_parts[0]]:
                            found_any = True
                            item_id, quest_id = dragonriding[dragon_parts[0]][dragon_parts[1]]
                            thing['rewards'].append(dict(
                                type='item',
                                id=item_id,
                                name=f'{dragon_parts[0]} > {dragon_parts[1]}',
                            ))

                    if found_any:
                        continue

                print(line_number, 'reward??', line)
                continue

            m = re.match(r'^\}\) --\s*(.*?)$', line)
            if m:
                thing['name'] = m.group(1)

                if thing_type == 'Treasure':
                    thing['reset'] = 'never'
                    treasures.append(thing)
                else:
                    kills.append(thing)

                thing = None
                continue

            m = re.match(r'^id\s*=\s*(\d+),?$', line)
            if m:
                thing['id'] = int(m.group(1))
                continue

            m = re.match(r'^quest\s*=\s*(\d+).*?$', line)
            if m:
                thing['quests'] = [m.group(1)]
                continue

            m = re.match(r'^quest\s*=\s*\{(.*?)\},?$', line)
            if m:
                thing['quests'] = m.group(1).split(', ')
                continue

            m = re.match(r'^(faction)\s*=\s*\'(.*?)\',?$', line)
            if m:
                thing['faction'] = m.group(2)
                continue

            print(line_number, '??', line)
    
    # Done with the file
    counts = {}
    for farm in kills + treasures:
        for reward in farm['rewards']:
            counts[f'{reward["type"]}|{reward["id"]}'] = counts.get(f'{reward["type"]}|{reward["id"]}', 0) + 1

    added = {}

    if len(kills) > 0:
        print()
        print('# Kills')

        for thing in sorted(kills, key=lambda t: t['name']):
            print_thing(counts, added, thing, 'kill')

    if len(treasures) > 0:
        print()
        print('# Treasures')

        for thing in sorted(treasures, key=lambda t: t['name']):
            print_thing(counts, added, thing, 'treasure')


def print_thing(counts, added, thing, thing_type):
    #if len(thing['rewards']) == 0:
    #    return

    print()
    print(f'- name: "{thing["name"]}"')

    if 'faction' in thing:
        print(f'  faction: {thing["faction"].lower()}')

    print(f'  location: {thing["location"]}')

    if 'id' in thing:
        print(f'  npcId: {thing["id"]}')

    if 'quests' in thing:
        print(f'  questId: {" ".join(thing["quests"])}')

    if 'reset' in thing:
        print(f'  reset: {thing["reset"]}')

    print(f'  type: {thing_type}')
    
    print(f'  drops:')

    first = True
    sorted_drops = sorted(thing['rewards'], key=lambda r: [TYPE_ORDER.get(r['type'], 99), r['name']])
    for drop in sorted_drops:
        if first:
            first = False
        else:
            print()

        drop_key = f'{drop["type"]}|{drop["id"]}'
        if counts[drop_key] == 1:
            print(f'    - type: {drop["type"]}')
            print(f'      id: {drop["id"]} # {drop["name"]}')
            if 'limit' in drop:
                print(f'      limit: {drop["limit"]}')
        else:
            if drop_key in added:
                print(f'    - *{slugify(drop["name"])} # {drop["name"]}')
            else:
                print(f'    - &{slugify(drop["name"])}')
                print(f'      type: {drop["type"]}')
                print(f'      id: {drop["id"]} # {drop["name"]}')
                if 'limit' in drop:
                    print(f'      limit: {drop["limit"]}')
                added[drop_key] = True

def slugify(s):
    return s.split(' [')[0].lower().replace("'", '').replace(' > ', ' ').replace(' ', '-')


dragonriding = dict(
    RenewedProtoDrake = dict(
        Antlers = [202278, 73058],
        Armor = [197357, 69558],
        BeakedSnout = [197401, 69602],
        BlackAndRedArmor = [197348, 69549],
        BlackScales = [197392, 69593],
        BlueHair = [197368, 69569],
        BlueScales = [197390, 69591],
        BovineHorns = [197377, 69578],
        BronzeAndPinkArmor = [197353, 69554],
        BronzeScales = [197391, 69592],
        BrownHair = [197369, 69570],
        ClubTail = [197403, 69604],
        CurledHorns = [197375, 69576],
        CurvedHorns = [197380, 69581],
        CurvedSpikedBrow = [197358, 69559],
        DualHornedCrest = [197366, 69567],
        Ears = [197376, 69577],
        FinnedCrest = [197365, 69566],
        FinnedJaw = [197388, 69589],
        FinnedTail = [197404, 69605],
        FinnedThroat = [197408, 69609],
        GoldAndBlackArmor = [197346, 69547],
        GoldAndRedArmor = [197351, 69552],
        GoldAndWhiteArmor = [197349, 69550],
        GradientHorns = [197381, 69582],
        GrayHair = [197367, 69568],
        GreenHair = [197371, 69572],
        GreenScales = [192523, 66720],
        HairyBack = [197356, 69557],
        HairyBrow = [197359, 69560],
        HarrierPattern = [197395, 69596],
        HeavyHorns = [197383, 69584],
        HeavyScales = [197397, 69598],
        Helm = [197373, 69574],
        HornedBack = [197354, 69555],
        HornedJaw = [197385, 69586],
        ImpalerHorns = [197379, 69580],
        ManedCrest = [197363, 69564],
        ManedTail = [197405, 69606],
        PlatedJaw = [202275, 73059],
        PredatorPattern = [197394, 69595],
        ProngedTail = [202280, 73060],
        PurpleHair = [197372, 69573],
        RazorSnout = [197399, 69600],
        RedHair = [197370, 69571],
        SharkSnout = [197400, 69601],
        ShortSpikedCrest = [197364, 69565],
        SilverAndBlueArmor = [197347, 69548],
        SilverAndPurpleArmor = [197350, 69551],
        SkyterrorPattern = [197396, 69597],
        SnubSnout = [197398, 69599],
        SpikedClubTail = [197402, 69603],
        SpikedCrest = [197361, 69562],
        SpikedJaw = [197386, 69587],
        SpikedThroat = [197407, 69608],
        SpinedBrow = [197360, 69561],
        SpinedCrest = [197362, 69563],
        SpinedTail = [197406, 69607],
        SteelAndYellowArmor = [197352, 69553],
        SubtleHorns = [197378, 69579],
        SweptHorns = [197374, 69575],
        ThickSpinedJaw = [197355, 69556],
        ThinSpinedJaw = [197387, 69588],
        WhiteHorns = [197382, 69583],
        WhiteScales = [197393, 69594],
    ),
    WindborneVelocidrake = dict(
        Armor = [197588, 69792],
        BeakedSnout = [197620, 69824],
        BlackFur = [197597, 69801],
        BlackScales = [197611, 69815],
        BlueScales = [197612, 69816],
        BronzeAndGreenArmor = [197577, 69781],
        BronzeScales = [197613, 69817],
        ClubTail = [197624, 69828],
        ClusterHorns = [197602, 69806],
        CurledHorns = [197605, 69809],
        CurvedHorns = [197603, 69807],
        ExposedFinnedBack = [197583, 69787],
        ExposedFinnedNeck = [197626, 69831],
        ExposedFinnedTail = [197621, 69825],
        FeatheredBack = [197587, 69791],
        FeatheredNeck = [197630, 69836],
        FeatheryHead = [197593, 69797],
        FeatheryTail = [197625, 69829],
        FinnedBack = [197584, 69788],
        FinnedEars = [197595, 69799],
        FinnedNeck = [197627, 69832],
        FinnedTail = [197622, 69826],
        GoldAndRedArmor = [197580, 69784],
        GrayHair = [197598, 69802],
        GrayHorns = [197608, 69812],
        HairyHead = [197591, 381190],
        HeavyScales = [197617, 69821],
        Helm = [197600, 69804],
        HookedSnout = [197619, 69823],
        HornedJaw = [197596, 69800],
        LargeHeadFin = [197589, 69793],
        LongSnout = [197618, 69822],
        ManedBack = [197585, 69789],
        OxHorns = [197604, 69808],
        PlatedNeck = [197628, 69834],
        ReaverPattern = [197635, 69846],
        RedHair = [197599, 69803],
        RedScales = [197614, 69818],
        ShriekerPattern = [197636, 69847],
        SilverAndBlueArmor = [197578, 69782],
        SilverAndPurpleArmor = [197581, 69785],
        SmallEars = [197594, 69798],
        SmallHeadFin = [197590, 69794],
        SpikedBack = [197586, 69790],
        SpikedNeck = [197629, 69835],
        SpikedTail = [197623, 69827],
        SpinedHead = [197592, 69796],
        SplitHorns = [197607, 69811],
        SteelAndOrangeArmor = [197579, 69783],
        SweptHorns = [197606, 69810],
        TealScales = [197615, 69819],
        WavyHorns = [197601, 69805],
        WhiteAndPinkArmor = [197582, 69786],
        WhiteHorns = [197609, 69813],
        WhiteScales = [197616, 69820],
        WindsweptPattern = [197634, 69845],
        YellowHorns = [197610, 69814],
    ),
    HighlandDrake = dict(
        Armor = [197099, 69300],
        BlackHair = [197117, 69318],
        BlackScales = [197142, 69343],
        BladedTail = [197153, 69354],
        BronzeAndGreenArmor = [197156, 69357],
        BronzeScales = [197145, 69346],
        BrownHair = [197118, 69319],
        BushyBrow = [197101, 69302],
        ClubTail = [197149, 69350],
        CoiledHorns = [197125, 69326],
        CrestedBrow = [197100, 69301],
        CurledBackHorns = [197128, 69329],
        Ears = [197116, 69317],
        EmbodimentOfTheCrimsonGladiator = [201792, 72371],
        FinnedBack = [197098, 69299],
        FinnedHead = [197106, 69307],
        FinnedNeck = [197155, 69356],
        GoldAndBlackArmor = [197090, 69290],
        GoldAndRedArmor = [197094, 69295],
        GoldAndWhiteArmor = [197095, 69296],
        GrandThornHorns = [197127, 69328],
        GreenScales = [197143, 69344],
        HairyCheek = [197131, 69332],
        HeavyHorns = [197122, 69323],
        HeavyScales = [197147, 69348],
        Helm = [197119, 69320],
        HookedHorns = [197126, 69327],
        HookedTail = [197152, 69353],
        HornedChin = [197102, 69303],
        LargeSpottedPattern = [197139, 69340],
        ManedChin = [197103, 69304],
        ManedHead = [197111, 69312],
        MultiHornedHead = [197114, 69315],
        OrnateHelm = [197120, 69321],
        PiratesDayArmor = [208858, 77875],
        PlatedHead = [197110, 69311],
        RedScales = [197144, 69345],
        ScaledPattern = [197141, 69342],
        SilverAndBlueArmor = [197091, 69291],
        SilverAndPurpleArmor = [197093, 69294],
        SingleHornedHead = [197112, 69313],
        SleekHorns = [197129, 69330],
        SmallSpottedPattern = [197140, 69341],
        SpikedCheek = [197132, 69333],
        SpikedClubTail = [197150, 69351],
        SpikedHead = [197109, 69310],
        SpikedLegs = [197134, 69335],
        SpikedTail = [197151, 69352],
        SpinedBack = [197097, 69298],
        SpinedCheek = [197133, 69334],
        SpinedChin = [197105, 69306],
        SpinedHead = [197108, 69309],
        SpinedNeck = [197154, 69355],
        SpinedNose = [197137, 69338],
        StagHorns = [197130, 69331],
        SteelAndYellowArmor = [197096, 69297],
        StripedPattern = [197138, 69339],
        SweptHorns = [197124, 69325],
        SweptSpikedHead = [197113, 69314],
        TanHorns = [197121, 69322],
        TaperedChin = [197104, 69305],
        TaperedNose = [197136, 69337],
        ThornedJaw = [197115, 69324],
        ThornHorns = [197123, 69316],
        ToothyMouth = [197135, 69336],
        TripleFinnedHead = [197107, 69308],
        VerticalFinnedTail = [197148, 69349],
        WhiteScales = [197146, 69347],
    ),
    CliffsideWylderdrake = dict(
        Armor = [196961, 69161],
        BlackHair = [196986, 69186],
        BlackHorns = [196991, 69191],
        BlackScales = [197013, 69213],
        BlondeHair = [196987, 69187],
        BlueScales = [197012, 69212],
        BluntSpikedTail = [197019, 69219],
        BranchedHorns = [196996, 69196],
        BronzeAndTealArmor = [196965, 69165],
        CoiledHorns = [197000, 69200],
        ConicalHead = [196981, 69181],
        CurledHeadHorns = [196979, 69179],
        DarkSkinVariation = [197015, 69215],
        DualHornedChin = [196973, 69173],
        Ears = [196982, 69182],
        FinnedBack = [196969, 69169],
        FinnedCheek = [197001, 69201],
        FinnedJaw = [196984, 69184],
        FinnedNeck = [197022, 69222],
        FinnedTail = [197018, 69218],
        FlaredCheek = [197002, 69202],
        FourHornedChin = [196974, 69174],
        GoldAndBlackArmor = [196964, 69164],
        GoldAndOrangeArmor = [196966, 69166],
        GoldAndWhiteArmor = [196967, 69167],
        GreenScales = [197011, 69211],
        HeadFin = [196975, 69175],
        HeadMane = [196976, 69176],
        HeavyHorns = [196992, 69192],
        Helm = [196990, 69190],
        HookHorns = [196998, 69198],
        HornedJaw = [196985, 69185],
        HornedNose = [197005, 69205],
        LargeTailSpikes = [197017, 69217],
        ManedJaw = [196983, 69183],
        ManedNeck = [197023, 69223],
        ManedTail = [197016, 69216],
        NarrowStripesPattern = [197008, 69208],
        PlatedBrow = [196972, 69172],
        PlatedNose = [197006, 69206],
        RedHair = [196988, 69188],
        RedScales = [197010, 69210],
        ScaledPattern = [197009, 69209],
        ShortHorns = [196994, 69194],
        SilverAndBlueArmor = [196963, 69163],
        SilverAndPurpleArmor = [196962, 69162],
        SleekHorns = [196993, 69193],
        SmallHeadSpikes = [196978, 69178],
        SpearTail = [197020, 69220],
        SpikedBack = [196970, 69170],
        SpikedBrow = [196971, 69171],
        SpikedCheek = [197003, 69203],
        SpikedClubTail = [197021, 69221],
        SpikedHorns = [196995, 69195],
        SpikedLegs = [197004, 69204],
        SplitHeadHorns = [196977, 69177],
        SplitHorns = [196997, 69197],
        SteelAndYellowArmor = [196968, 69168],
        SweptHorns = [196999, 69199],
        TripleHeadHorns = [196980, 69180],
        WhiteHair = [196989, 69189],
        WhiteScales = [197014, 69214],
        WideStripesPattern = [197007, 69207],
    ),
    WindingSlitherdrake = dict(
        AntlerHorns = [203338, 73829],
        Armor = [203305, 73793],
        BlondeHair = [203322, 73810],
        BlueAndSilverArmor = [203300, 73788],
        BlueScales = [203350, 73841],
        BronzeScales = [203351, 842],
        BrownHair = [203323, 73811],
        ClusterChinHorn = [203312, 73800],
        ClusterHorns = [203331, 73820],
        ClusterJawHorns = [203340, 73831],
        CurledCheekHorn = [203321, 73809],
        CurledHorns = [203334, 73824],
        CurledNose = [203346, 73837],
        CurvedChinHorn = [203314, 73802],
        CurvedHorns = [203335, 73825],
        CurvedNoseHorn = [203349, 73840],
        Ears = [203320, 73808],
        FinnedCheek = [203319, 73807],
        FinnedTipTail = [203361, 73853],
        GrandChinThorn = [203310, 73798],
        GreenAndBronzeArmor = [203299, 73787],
        GreenScales = [203352, 73843],
        HairyBrow = [203308, 73796],
        HairyChin = [203311, 73799],
        HairyCrest = [203318, 73806],
        HairyJaw = [203343, 73834],
        HairyTail = [203362, 73854],
        HairyThroat = [203365, 73857],
        HeavyHorns = [203329, 73817],
        HeavyScales = [205341, 75743],
        Helm = [203326, 73814],
        HornedBrow = [203306, 73794],
        ImpalerHorns = [203339, 73830],
        LargeFinnedCrest = [203316, 73804],
        LargeFinnedTail = [203360, 73852],
        LargeFinnedThroat = [203363, 73855],
        LargeSpikedNose = [203347, 73838],
        LightBlueAndCopperArmor = [203301, 73789],
        LongChinHorn = [203309, 73797],
        LongJawHorns = [203341, 73832],
        PairedHorns = [203336, 73826],
        PlatedBrow = [203307, 73795],
        PointedNose = [203348, 73839],
        PurpleAndSilverArmor = [203302, 73790],
        RedAndGoldArmor = [203303, 73791],
        RedHair = [203325, 73813],
        RedScales = [203353, 73844],
        SharkFinnedTail = [203359, 73851],
        ShortHorns = [203333, 73822],
        ShortSpikedCrest = [197364, 69565],
        SingleJawHorn = [203344, 73835],
        SmallFinnedCrest = [203317, 73805],
        SmallFinnedTail = [203358, 73850],
        SmallFinnedThroat = [203364, 73856],
        SmallSpikedCrest = [203315, 73803],
        SpikedChin = [203313, 73801],
        SpikedHorns = [203332, 73821],
        SpikedTail = [203357, 73849],
        SplitJawHorns = [203345, 73836],
        SweptHorns = [203330, 73818],
        TanHorns = [203327, 73815],
        ThornHorns = [203337, 73827],
        TripleJawHorns = [203342, 73833],
        WhiteAndGoldArmor = [203298, 73786],
        WhiteHair = [203324, 73812],
        WhiteHorns = [203328, 73816],
        WhiteScales = [203354, 73845],
        YellowAndSilverArmor = [203304, 73792],
        YellowScales = [203355, 73846],
    )
)


if __name__ == '__main__':
    main()
