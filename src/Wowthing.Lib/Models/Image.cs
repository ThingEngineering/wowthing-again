using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    [Index(nameof(Type), nameof(Sha256), nameof(Format))]
    public class Image
    {
        public int Id { get; set; }
        public ImageType Type { get; set; }
        public ImageFormat Format { get; set; }

        [Column(TypeName = "char(64)")]
        public string Sha256 { get; set; }

        public byte[] Data { get; set; }

        public string Url => $"/image/{(int)Type}/{Sha256}.{Format.ToString().ToLower()}";
    }
}
