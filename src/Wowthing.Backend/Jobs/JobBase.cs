using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Serilog;

namespace Wowthing.Backend.Jobs
{
    public abstract class JobBase : IWorkerJob
    {
        protected HttpClient _http;
        protected ILogger _logger;

        protected const string API_HOST = "{0}.api.blizzard.com";

        protected JobBase(HttpClient http, ILogger logger)
        {
            _http = http;
            _logger = logger;
        }

        public abstract Task Run();
    }
}
