using Microsoft.EntityFrameworkCore.Internal;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;

namespace Wowthing.Tool.Tools;

public class DumpsTool
{
    public DumpsTool()
    {
    }

    public async Task Run()
    {
        Func<WowDbContext, Task>[] actions =
        {
            // ImportCharacterClasses,
            // ImportCharacterRaces,
            // ImportCharacterSpecializations,
            // ImportCurrencies,
            // ImportCurrencyCategories,
            // ImportFactions,
            // ImportHolidays,
            // ImportInstances,
            // ImportItems,
            // ImportItemAppearances,
            // ImportItemEffects,
            // ImportMounts,
            // ImportPets,
            // ImportToys,
        };

        foreach (var action in actions)
        {
            //Logger.Information("Running {0}", action.Method.Name);
            await using var context = ToolContext.GetDbContext();
            await action(context);
            await context.SaveChangesAsync();
        }

        return;
    }
}
