# New season

## `apps/backend/Models/API/NonBlizzard/ApiCharacterRaiderIo.cs`

- Add the new season to `ApiCharacterRaiderIoSeason.SeasonMap`

## `apps/frontend/data/contants.ts`

- Change `Constants.mythicPlusSeason` to the new season

## `apps/frontend/data/dungeon.ts`

- Add any new dungeons to `dungeons`, `MapChallengeMode.db2` has the info
- Add a new `orderBlah` for dungeon order (if necessary)
- Update `seasonMap` to add the new season
- Update `keyVaultItemLevel` with the new M+ vault item levels
- Update `raidVaultItemLevel` with the new raid vault item levels

## `apps/frontend/utils/mythic-plus/get-dungeon-level.ts`

- Add anything new from `WeeklyRewardChestActivityTier` to the branches
