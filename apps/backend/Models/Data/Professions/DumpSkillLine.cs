﻿using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data.Professions
{
    public class DumpSkillLine
    {
        public int ID { get; set; }
        public int CategoryID { get; set; }
        public int Flags { get; set; }
        public int ParentSkillLineID { get; set; }
        public int ParentTierIndex { get; set; }
        
        [Name("DisplayName_lang")]
        public string DisplayName { get; set; }
        
        [Name("HordeDisplayName_lang")]
        public string HordeDisplayName { get; set; }
    }
}
