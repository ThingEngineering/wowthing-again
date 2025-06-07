export enum Gender {
    Female,
    Male,
}

export const genderValues: string[] = Object.keys(Gender).filter(
    (gender) => !isNaN(Number(gender)),
);
