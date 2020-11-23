using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Backend.Jobs.Misc
{
    public class CollectionsJob : JobBase
    {
        public override async Task Run(params string[] data)
        {
            _logger.Debug("sigh {@d}", data);
            await Task.Delay(1);
        }
    }
}
