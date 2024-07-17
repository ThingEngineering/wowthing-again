﻿using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowWorldQuest
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Id { get; set; }

    public short Expansion { get; set; }
    public WowFaction Faction { get; set; } = WowFaction.Neutral;
    public short MaxLevel { get; set; }
    public short MinLevel { get; set; }
    public short QuestInfoId { get; set; }

    public List<int> NeedQuestIds { get; set; }
    public List<int> SkipQuestIds { get; set; }

    public WowWorldQuest(int id)
    {
        Id = id;
    }
}
