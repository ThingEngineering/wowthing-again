using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace Wowthing.Lib.Models
{
    public class ApplicationUser : IdentityUser<long>
    {
        [Column(TypeName = "jsonb")]
        public ApplicationUserSettings Settings { get; set; }
    }
}
