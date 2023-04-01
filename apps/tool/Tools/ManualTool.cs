using Serilog.Context;

namespace Wowthing.Tool.Tools;

public class ManualTool
{
    public async Task Run()
    {
        using var foo = LogContext.PushProperty("Task", "Manual");
        await using var context = ToolContext.GetDbContext();
    }
}
