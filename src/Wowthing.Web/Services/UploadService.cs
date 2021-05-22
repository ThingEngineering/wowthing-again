using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Repositories;

namespace Wowthing.Web.Services
{
    public class UploadService
    {
        private readonly JobRepository _jobRepository;

        public UploadService(JobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        public async Task Process(int userId, IFormFile luaFile)
        {
            using var memoryStream = new MemoryStream();
            await luaFile.CopyToAsync(memoryStream);

            using var reader = new StreamReader(memoryStream, System.Text.Encoding.UTF8, true);
            var data = await reader.ReadToEndAsync();

            await _jobRepository.AddJobAsync(JobPriority.High, JobType.Upload, userId.ToString(), data);
        }
    }
}
