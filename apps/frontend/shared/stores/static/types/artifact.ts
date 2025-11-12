export interface StaticDataArtifact {
    chrSpecializationId: number;
    id: number;
    name: string;
    appearanceSets: StaticDataArtifactAppearanceSet[];
}

export interface StaticDataArtifactAppearanceSet {
    name: string;
    appearances: StaticDataArtifactAppearance[];
}

export interface StaticDataArtifactAppearance {
    appearanceModifier: number;
    id: number;
    name: string;
    swatchColor: string;
}
