import type { Character } from './character';

export type CharacterProps = {
    character: Character;
};

export type SlugsProps = {
    slug1: string;
    slug2?: string;
    slug3?: string;
    slug4?: string;
    slug5?: string;
    slug6?: string;
    slug7?: string;
    slug8?: string;
    slug9?: string;
};

export type ParamsSlugsProps = {
    params: SlugsProps;
};

export type SortableProps = {
    getSortState: (prefix?: string) => number;
    setSortState: (prefix?: string) => void;
};
