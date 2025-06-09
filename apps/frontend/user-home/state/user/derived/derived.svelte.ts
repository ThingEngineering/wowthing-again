import { UserCount } from '@/types';

type GenericCategory<T> = {
    name: string;
    items: T[];
};
type DoGenericParameters<T, U> = {
    categories: T[];
    haveFunc: (item: U) => boolean;
    includeUnavailable: boolean;
    haveCountFunc?: (item: U) => number;
    totalCountFunc?: (item: U) => number;
};
type UserCounts = Record<string, UserCount>;

export class DataUserDerived {
    private doGeneric<T extends GenericCategory<U>, U>(
        params: DoGenericParameters<T, U>
    ): UserCounts {
        const counts: UserCounts = {};
        const overallData = (counts['OVERALL'] = new UserCount());

        for (const category of params.categories) {
            const categoryUnavailable = category.name.startsWith('Unavailable');
            const availabilityData = (counts[categoryUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'] ||=
                new UserCount());
            const categoryData = (counts[category.name] = new UserCount());

            for (const item of category.items) {
                const userHas = params.haveFunc(item);

                if (categoryUnavailable && params.includeUnavailable !== true && !userHas) {
                    continue;
                }

                const totalCount = params.totalCountFunc?.(item) || 1;
                overallData.total += totalCount;
                availabilityData.total += totalCount;
                categoryData.total += totalCount;

                if (userHas) {
                    const haveCount = params.haveCountFunc?.(item) || 1;
                    overallData.have += haveCount;
                    availabilityData.have += haveCount;
                    categoryData.have += haveCount;
                }
            }
        }

        return counts;
    }
}
