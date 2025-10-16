import { BackgroundImage } from '@/types';

const spaceBackground =
    '<a href="https://www.vecteezy.com/free-vector/space-background">Space Background Vectors by Vecteezy</a>';

export const backgrounds: BackgroundImage[] = [
    new BackgroundImage(
        1,
        'vecteezy/2496764.jpg',
        'artbyphilomena - Rainbow with Clouds',
        spaceBackground,
        9,
        10
    ),
    new BackgroundImage(
        2,
        'vecteezy/180838.jpg',
        'ticklishpanda123 - Beautiful Northern Lights',
        spaceBackground
    ),
    new BackgroundImage(
        3,
        'vecteezy/201488.jpg',
        'Vectorbox Studio - Blue Landscape',
        spaceBackground
    ),
    new BackgroundImage(
        4,
        'vecteezy/210492.jpg',
        'Kirsty Pargeter - Tree Landscape',
        spaceBackground
    ),
    new BackgroundImage(
        5,
        'vecteezy/273915.jpg',
        'commercialart - Ocean',
        '<a href="https://www.vecteezy.com/free-vector/nature">Nature Vectors by Vecteezy</a>'
    ),
    new BackgroundImage(
        6,
        'vecteezy/2773418.jpg',
        'Nasik Lababan - Calming Purple Tropical Background',
        '<a href="https://www.vecteezy.com/free-vector/background">Background Vectors by Vecteezy</a>'
    ),
    new BackgroundImage(
        7,
        'vecteezy/2852371.jpg',
        'alexander7david - Colorful Fireworks Background',
        spaceBackground
    ),
    new BackgroundImage(
        8,
        'vecteezy/13681213.jpg',
        'PRAMOTE LERTNITIVA - Abstract Neon Background',
        '<a href="https://www.vecteezy.com/free-vector/pink">Pink Vectors by Vecteezy</a>'
    ),
    new BackgroundImage(
        9,
        'vecteezy/13419001.jpg',
        'F13Auto Wrap - Happy Halloween Background',
        '<a href="https://www.vecteezy.com/free-vector/grunge">Grunge Vectors by Vecteezy</a>'
    ),
];

export const backgroundMap: Record<number, BackgroundImage> = Object.fromEntries(
    backgrounds.map((b) => [b.id, b])
);
