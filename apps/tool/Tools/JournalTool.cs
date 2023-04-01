using Serilog.Context;

namespace Wowthing.Tool.Tools;

public class JournalTool
{
    public async Task Run()
    {
        using var foo = LogContext.PushProperty("Task", "Journal");
        await using var context = ToolContext.GetDbContext();
    }
}
