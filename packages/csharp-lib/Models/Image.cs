using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models;

[Index(nameof(Type), nameof(Sha256), nameof(Format))]
public class Image
{
    public int Id { get; set; }
    public ImageType Type { get; set; }
    public ImageFormat Format { get; set; }

    [Column(TypeName = "char(64)")]
    public string Sha256 { get; set; }

    public byte[] Data { get; set; }

    public string Url => Data == null ? $"/{S3Path}" : $"/image/{(int)Type}/{Sha256}.{Format.ToString().ToLower()}";

    public string S3Path => $"{(int)Type}/{Sha256[0]}/{Sha256[1]}/{Sha256}.{Format.ToString().ToLower()}";
}
