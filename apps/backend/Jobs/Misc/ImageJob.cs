using Imageflow.Fluent;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc;

public class ImageJob : JobBase
{
    public override async Task Run(string[] data)
    {
        ImageType type = (ImageType)int.Parse(data[0]);
        int id = int.Parse(data[1]);
        ImageFormat format = (ImageFormat)int.Parse(data[2]);
        string url = data[3];

        var timer = new JankTimer();

        var result = await GetUriAsBytesAsync(new Uri(url), useAuthorization: false, useLastModified: false, timer: timer);
        if (result.NotModified)
        {
            LogNotModified();
            return;
        }

        string sha256 = result.Data.Sha256();

        var image = await Context.Image.FindAsync(type, id, format);
        if (image == null)
        {
            image = new Image
            {
                Type = type,
                Id = id,
                Format = format,
            };
            Context.Image.Add(image);
        }
        else if (image.Sha256 == sha256)
        {
            Logger.Debug("Hash matches");
            return;
        }
        else if (S3Service.IsEnabled)
        {
            // Hash is changing, delete the old file if a single row references it
            int rowCount = await Context.Image
                .Where(img => img.Type == image.Type &&
                              img.Sha256 == image.Sha256 &&
                              img.Format == image.Format)
                .CountAsync(CancellationToken);
            if (rowCount == 1)
            {
                await S3Service.DeleteImageAsync(image,  CancellationToken);
                timer.AddPoint("S3Delete");
            }
        }

        image.Sha256 = sha256;

        if (
            (format == ImageFormat.Jpeg && (url.EndsWith(".jpg") || url.EndsWith(".jpeg"))) ||
            (format == ImageFormat.Png && url.EndsWith(".png")) ||
            (format == ImageFormat.WebP && url.EndsWith(".webp"))
        )
        {
            image.Data = result.Data;
        }
        else if (format == ImageFormat.WebP)
        {
            using (var job = new Imageflow.Fluent.ImageJob())
            {
                var converted = await job
                    .Decode(result.Data)
                    .CropWhitespace(80, 0f)
                    .EncodeToBytes(new WebPLossyEncoder(75))
                    .Finish()
                    .InProcessAsync();

                var convertedBytes = converted.First.TryGetBytes();
                if (!convertedBytes.HasValue)
                {
                    throw new Exception($"Image conversion failed: type={type} id={id} format={format} url={url}");
                }

                image.Data = convertedBytes.Value.ToArray();
            }
        }
        else
        {
            throw new Exception($"Invalid ImageJob parameters: type={type} id={id} format={format} url={url}");
        }

        timer.AddPoint("Convert");

        // Upload the file instead if we're using S3
        if (S3Service.IsEnabled)
        {
            bool uploadOk = await S3Service.UploadImageAsync(image, CancellationToken);
            if (uploadOk)
            {
                image.Data = null;
            }
            else
            {
                Logger.Warning("Upload failed: {path}", image.S3Path);
            }
            timer.AddPoint("S3Upload");
        }

        await Context.SaveChangesAsync(CancellationToken);

        timer.AddPoint("Save", true);
        Logger.Debug("{Timer}", timer.ToString());
    }
}
