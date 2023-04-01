using Serilog.Context;

namespace Wowthing.Tool.Tools;

public class StaticTool
{
    public async Task Run()
    {
        using var foo = LogContext.PushProperty("Task", "Static");
        await using var context = ToolContext.GetDbContext();
    }
}
