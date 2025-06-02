import type { InstanceType } from '@/enums/instance-type';

export class Difficulty {
    constructor(
        public id: number,
        public name: string,
        public shortName: string,
        public instanceType: InstanceType,
        public minPlayers: number,
        public maxPlayers: number,
    ) {}
}
