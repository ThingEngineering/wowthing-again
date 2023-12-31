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

        var result = await GetBytes(new Uri(url), useAuthorization: false, useLastModified: false, timer: timer);
        if (result.NotModified)
        {
            LogNotModified();
            return;
        }

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
                if (convertedBytes.HasValue)
                {
                    image.Data = convertedBytes.Value.ToArray();
                }
                else
                {
                    throw new Exception($"Image conversion failed: type={type} id={id} format={format} url={url}");
                }
            }
        }
        else
        {
            throw new Exception($"Invalid ImageJob parameters: type={type} id={id} format={format} url={url}");
        }

        timer.AddPoint("Convert");

        var sha256 = image.Data.Sha256();
        if (sha256 == image.Sha256)
        {
            Logger.Debug("Hash matches");
            return;
        }

        image.Sha256 = sha256;

        await Context.SaveChangesAsync();

        timer.AddPoint("Save", true);
        Logger.Debug("{Timer}", timer.ToString());
    }
}
