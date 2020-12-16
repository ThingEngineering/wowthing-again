using System;
using System.Collections.Generic;
using System.Text;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class WowPeriod
    {
        public WowRegion Region { get; set; }
        public int Id { get; set; }
        public DateTime Starts { get; set; }
        public DateTime Ends { get; set; }
    }
}
