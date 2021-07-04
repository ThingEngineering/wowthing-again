using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace Wowthing.Lib.Models
{
    public class ApplicationUser : IdentityUser<long>
    {
        public string ApiKey { get; set; }

        private const int API_KEY_LENGTH = 16;

        [Column(TypeName = "jsonb")]
        public ApplicationUserSettings Settings { get; set; }

        public void GenerateApiKey()
        {
            var serviceProvider = new RNGCryptoServiceProvider();
            byte[] bytes = new byte[API_KEY_LENGTH];
            serviceProvider.GetBytes(bytes);
            ApiKey = BitConverter.ToString(bytes).Replace("-", "");
        }
    }
}
