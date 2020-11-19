using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Backend.Jobs
{
    public interface IJob
    {
        Task Run(params string[] data);
    }
}
