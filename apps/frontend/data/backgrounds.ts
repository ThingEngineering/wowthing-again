import { BackgroundImage } from '@/types';

// DON'T REMOVE OR REUSE ID
enum backgroundId {
    artbyphilomenaRainbowWithClouds = 1,
    ticklishpanda123BeautifulNorthernLights = 2,
    vectorboxStudioBlueLandscape = 3,
    kirstyPargeterTreeLandscape = 4,
    commercialartOcean = 5,
    nasikLababanCalmingPurpleTropical = 6,
    alexander7davidColorfulFireworks = 7,
    pramoteLertnitivaAbstractNeon = 8,
    f13autoWrapHappyHalloween = 9,
    nganLeQuynhHearts = 10,
    takeshiIshikawaFreshGreen = 11,
    bubundesignGoldenBox = 12,
}

const attributionBackground =
    '<a href="https://www.vecteezy.com/free-vector/background">Background Vectors by Vecteezy</a>';
const attributionSpaceBackground =
    '<a href="https://www.vecteezy.com/free-vector/space-background">Space Background Vectors by Vecteezy</a>';

export const backgrounds: BackgroundImage[] = [
    new BackgroundImage(
        backgroundId.artbyphilomenaRainbowWithClouds,
        'vecteezy/2496764.jpg',
        'artbyphilomena - Rainbow with Clouds',
        attributionSpaceBackground,
        9,
        10
    ),
    new BackgroundImage(
        backgroundId.ticklishpanda123BeautifulNorthernLights,
        'vecteezy/180838.jpg',
        'ticklishpanda123 - Beautiful Northern Lights',
        attributionSpaceBackground
    ),
    new BackgroundImage(
        backgroundId.vectorboxStudioBlueLandscape,
        'vecteezy/201488.jpg',
        'Vectorbox Studio - Blue Landscape',
        attributionSpaceBackground
    ),
    new BackgroundImage(
        backgroundId.kirstyPargeterTreeLandscape,
        'vecteezy/210492.jpg',
        'Kirsty Pargeter - Tree Landscape',
        attributionSpaceBackground
    ),
    new BackgroundImage(
        backgroundId.commercialartOcean,
        'vecteezy/273915.jpg',
        'commercialart - Ocean',
        '<a href="https://www.vecteezy.com/free-vector/nature">Nature Vectors by Vecteezy</a>'
    ),
    new BackgroundImage(
        backgroundId.nasikLababanCalmingPurpleTropical,
        'vecteezy/2773418.jpg',
        'Nasik Lababan - Calming Purple Tropical Background',
        '<a href="https://www.vecteezy.com/free-vector/background">Background Vectors by Vecteezy</a>'
    ),
    new BackgroundImage(
        backgroundId.alexander7davidColorfulFireworks,
        'vecteezy/2852371.jpg',
        'alexander7david - Colorful Fireworks Background',
        attributionSpaceBackground
    ),
    new BackgroundImage(
        backgroundId.pramoteLertnitivaAbstractNeon,
        'vecteezy/13681213.jpg',
        'PRAMOTE LERTNITIVA - Abstract Neon Background',
        '<a href="https://www.vecteezy.com/free-vector/pink">Pink Vectors by Vecteezy</a>'
    ),
    new BackgroundImage(
        backgroundId.f13autoWrapHappyHalloween,
        'vecteezy/13419001.jpg',
        'F13Auto Wrap - Happy Halloween Background',
        '<a href="https://www.vecteezy.com/free-vector/grunge">Grunge Vectors by Vecteezy</a>'
    ),
    new BackgroundImage(
        backgroundId.nganLeQuynhHearts,
        'vecteezy/36250742.jpg',
        'Ngan Le Quynh - Hearts in Red Sky Background',
        attributionBackground
    ),
    new BackgroundImage(
        backgroundId.takeshiIshikawaFreshGreen,
        'vecteezy/1988909.jpg',
        'Takeshi Ishikawa - Fresh Green Background',
        attributionBackground
    ),
    new BackgroundImage(
        backgroundId.bubundesignGoldenBox,
        'vecteezy/834558.jpg',
        'bubundesign - 3D Cube Golden Box Abstract Background',
        '<a href="https://www.vecteezy.com/free-vector/3d-background">3d Background Vectors by Vecteezy</a>',
        5
    ),
];

export const backgroundMap: Record<number, BackgroundImage> = Object.fromEntries(
    backgrounds.map((b) => [b.id, b])
);
