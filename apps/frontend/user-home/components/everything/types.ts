import { UserCount } from '@/types';
import type { LookupType } from '@/enums/lookup-type';
import type { DbThingContentType } from '@/shared/stores/db/enums';
import type { DbDataThing } from '@/shared/stores/db/types';

export class SomethingThing {
    constructor(public thing: DbDataThing) {}

    public stats = new UserCount();
    public contents: {
        lookupId: number;
        lookupType: LookupType;
        originalId: number;
        originalType: DbThingContentType;
        userHas: boolean;
        quality: number;
        hasOnCharacterIds: number[];
    }[] = [];
}
