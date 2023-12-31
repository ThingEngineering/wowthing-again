namespace Wowthing.Backend.Jobs;

public interface IJob
{
    Task Run(string[] data);
}
