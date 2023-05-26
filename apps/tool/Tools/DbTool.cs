using Serilog.Context;

namespace Wowthing.Tool.Tools;

public class DbTool
{
    private readonly JankTimer _timer = new();

    public async Task Run(params string[] data)
    {
        using var foo = LogContext.PushProperty("Task", "Db");
        await using var context = ToolContext.GetDbContext();

        // TODO everything

        _timer.AddPoint("Generate", true);
        ToolContext.Logger.Information("{0}", _timer.ToString());
    }
}
