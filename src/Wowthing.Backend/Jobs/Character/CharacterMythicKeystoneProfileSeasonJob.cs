﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.User
{
    public class CharacterMythicKeystoneProfileSeasonJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}/mythic-keystone-profile/season/{2}";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            var seasonId = int.Parse(data[1]);
            using var shrug = CharacterLog(query);

            var path = string.Format(API_PATH, query.RealmSlug, query.CharacterName.ToLowerInvariant(), seasonId);
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterMythicKeystoneProfileSeason>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var seasonMap = await _context.PlayerCharacterMythicPlusSeason
                .Where(mps => mps.CharacterId == query.CharacterId)
                .ToDictionaryAsync(k => k.Season);

            if (result.Data.BestRuns != null)
            {
                if (!seasonMap.TryGetValue(seasonId, out PlayerCharacterMythicPlusSeason season))
                {
                    season = new PlayerCharacterMythicPlusSeason
                    {
                        CharacterId = query.CharacterId,
                        Season = seasonId,
                    };
                    _context.PlayerCharacterMythicPlusSeason.Add(season);
                }

                season.Runs = result.Data.BestRuns
                    .EmptyIfNull()
                    .Select(run => new PlayerCharacterMythicPlusRun()
                    {
                        Affixes = run.Affixes.Select(a => a.Id).ToList(),
                        Completed = run.CompletedTimestamp.AsUtcTimestamp(),
                        DungeonId = run.Dungeon.Id,
                        Duration = run.Duration,
                        KeystoneLevel = run.KeystoneLevel,
                        Members = run.Members.Select(member => new PlayerCharacterMythicPlusRunMember
                        {
                            ItemLevel = member.ItemLevel,
                            Name = member.Character.Name,
                            RealmId = member.Character.Realm.Id,
                            SpecializationId = member.Specialization.Id,
                        }).ToList(),
                        Timed = run.Timed,
                    })
                    .ToList();
            }

            await _context.SaveChangesAsync();
        }
    }
}
