using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Serilog;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs
{
    public class UserCharactersJob : JobBase
    {
        public UserCharactersJob(HttpClient http, ILogger logger, string data) : base(http, logger)
        {
        }

        public override Task Run()
        {
            return Task.CompletedTask;
        }
    }
}
