namespace Wowthing.Backend.Jobs
{
    public interface IJob
    {
        Task Run(params string[] data);
    }
}
