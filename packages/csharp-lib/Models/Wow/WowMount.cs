﻿using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow
{
    public class WowMount
    {
        [Key]
        public int Id { get; set; }

        public int Flags { get; set; }
        public int ItemId { get; set; }
        public int SpellId { get; set; }
        public short SourceType { get; set; }
    }
}
