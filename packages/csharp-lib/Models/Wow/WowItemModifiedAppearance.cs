﻿namespace Wowthing.Lib.Models.Wow
{
    public class WowItemModifiedAppearance
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int AppearanceId { get; set; }
        public short Modifier { get; set; }
    }
}
