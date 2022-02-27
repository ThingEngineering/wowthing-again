using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;

namespace Wowthing.Lib.Models
{
    public class ApplicationUser : IdentityUser<long>
    {
        public const int ApiKeyLength = 16;

        public bool CanUseSubdomain { get; set; } = false;
        public string ApiKey { get; set; }
        public DateTime LastVisit { get; set; } = DateTime.MinValue;

        [Column(TypeName = "jsonb")]
        public ApplicationUserSettings Settings { get; set; }

        public void GenerateApiKey()
        {
            var bytes = RandomNumberGenerator.GetBytes(ApiKeyLength);   
            ApiKey = BitConverter.ToString(bytes).Replace("-", "");
        }
    }
}
