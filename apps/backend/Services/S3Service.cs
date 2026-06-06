using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using Serilog;
using Wowthing.Backend.Models;
using Wowthing.Lib.Models;

namespace Wowthing.Backend.Services;

public class S3Service
{
    private readonly ILogger _logger;
    private readonly WowthingBackendOptions _backendOptions;

    public S3Service(IOptions<WowthingBackendOptions> backendOptions)
    {
        _backendOptions = backendOptions.Value;

        _logger = Log.ForContext("Service", $"S3Service");

        _logger.Information("Service starting");

        _logger.Debug("ImageAccessKeyId {0}",  _backendOptions.ImageAccessKeyId);
        _logger.Debug("ImageSecretAccessKey {0}",  _backendOptions.ImageSecretAccessKey);
        _logger.Debug("ImageEndpoint {0}",  _backendOptions.ImageEndpoint);
        _logger.Debug("ImageBucket {0}",  _backendOptions.ImageBucket);
    }

    private AmazonS3Client S3Client
    {
        get
        {
            if (field == null)
            {
                var credentials = new BasicAWSCredentials(_backendOptions.ImageAccessKeyId, _backendOptions.ImageSecretAccessKey);
                field = new AmazonS3Client(credentials, new AmazonS3Config
                {
                    ServiceURL = _backendOptions.ImageEndpoint
                });
            }
            return field;
        }
    }

    public bool IsEnabled => !string.IsNullOrEmpty(_backendOptions.ImageBucket);

    public async Task<bool> UploadImageAsync(Image image, CancellationToken cancellationToken)
    {
        using var memoryStream = new MemoryStream(image.Data);

        var request = new PutObjectRequest
        {
            BucketName = _backendOptions.ImageBucket,
            Key = image.S3Path,
            InputStream = memoryStream,
            ContentType = $"image/{image.Format.ToString().ToLower()}",
            // Cloudflare R2 doesn't support SigV4
            DisableDefaultChecksumValidation = true,
            DisablePayloadSigning = true,
        };
        var response = await S3Client.PutObjectAsync(request, cancellationToken);
        return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
    }

    public async Task<bool> DeleteImageAsync(Image image, CancellationToken cancellationToken)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = _backendOptions.ImageBucket,
            Key = image.S3Path,
        };
        var response = await S3Client.DeleteObjectAsync(request, cancellationToken);
        return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
    }
}
