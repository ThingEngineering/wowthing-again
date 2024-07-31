using Microsoft.AspNetCore.Http;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Web.Services;

public class UploadService
{
    private readonly JobRepository _jobRepository;
    private readonly IConnectionMultiplexer _redis;

    private static readonly TimeSpan ExpiryTime = TimeSpan.FromMinutes(60);

    public UploadService(
        IConnectionMultiplexer redis,
        JobRepository jobRepository
    )
    {
        _jobRepository = jobRepository;
        _redis = redis;
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
        string redisKey = string.Format(RedisKeys.UserUpload, userId, Guid.NewGuid().ToString("N"));

        var db = _redis.GetDatabase();
        await db.CompressedStringSetAsync(redisKey, luaData, ExpiryTime);

        await _jobRepository.AddJobAsync(JobPriority.High, JobType.UserUpload, userId.ToString(), redisKey);
    }
}
