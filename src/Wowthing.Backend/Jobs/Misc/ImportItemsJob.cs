using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc
{
    public class ImportItemsJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.ImportItems,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
            Version = 1,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();

            var csvTask = DataUtilities.LoadDumpCsvAsync<DumpItemSparse>("itemsparse");
            var dbTask = Context.WowItem.ToDictionaryAsync(item => item.Id);

            Task.WaitAll(csvTask, dbTask);
            _timer.AddPoint("Load");

            var itemMap = dbTask.Result;
            
            foreach (var row in csvTask.Result)
            {
                if (itemMap.TryGetValue(row.ID, out var item))
                {
                    if (item.Name != row.Name)
                    {
                        item.Name = row.Name;
                    }
                }
                else
                {
                    Context.WowItem.Add(new WowItem
                    {
                        Id = row.ID,
                        Name = row.Name,
                    });
                }
            }
            _timer.AddPoint("Process");
            
            await Context.SaveChangesAsync();
            _timer.AddPoint("Save");
            
            Logger.Information("{Timing}", _timer.ToString());
        }
    }
}
