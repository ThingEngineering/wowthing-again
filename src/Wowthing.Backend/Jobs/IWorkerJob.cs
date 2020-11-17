using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Backend.Jobs
{
    public interface IWorkerJob
    {
        Task Run();
    }
}
