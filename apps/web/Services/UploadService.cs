using Microsoft.AspNetCore.Http;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Web.Services;

public class UploadService
{
    private readonly JobRepository _jobRepository;

    public UploadService(JobRepository jobRepository)
    {
        _jobRepository = jobRepository;
    }

    public async Task Process(long userId, IFormFile luaFile)
    {
        using var memoryStream = new MemoryStream();
        await luaFile.CopyToAsync(memoryStream);
        memoryStream.Seek(0, SeekOrigin.Begin);

        using var reader = new StreamReader(memoryStream, System.Text.Encoding.UTF8, true);
        string data = await reader.ReadToEndAsync();

        await Process(userId, data);
    }

    public async Task Process(long userId, string luaData)
    {
        await _jobRepository.AddJobAsync(JobPriority.High, JobType.UserUpload, userId.ToString(), luaData);
    }
}
