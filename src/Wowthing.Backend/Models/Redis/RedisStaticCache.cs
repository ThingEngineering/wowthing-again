using System;
using System.Collections.Generic;
using System.Text;
using Wowthing.Lib.Models;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisStaticCache
    {
        public Dictionary<string, WowClass> Class { get; set; }
        public Dictionary<string, WowRace> Race { get; set; }
        public Dictionary<string, WowRealm> Realm { get; set; }
    }
}
