export const costOrder: number[] = [
    0, // Gold

    // Pet trading bullshit
    1036812, // Ground Gear
    1062072, // Robble's Wobbly Staff
    1067410, // Very Unlucky Rock
    1011406, // Rotting Bear Carcass
    1011944, // Dark Iron Baby Booties
    1025402, // The Stoppable Force
    1003300, // Rabbit's Foot
    1003670, // Large Slimy Bone
    1006150, // A Frayed Knot

    // Shadowlands
    1813, // Reservoir Anima
    1767, // Stygia
    1885, // Grateful Offering

    // Cataclysm
    1071617, // Crystallized Firestone
];

export const costOrderMap: Record<number, number> = Object.fromEntries(
    costOrder.map((value, index) => [value, index]),
);
