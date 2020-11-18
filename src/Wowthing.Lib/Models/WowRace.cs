using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class WowRace
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string IconFemale { get; set; }
        public string IconMale { get; set; }

        public string GetGenderIcon(WowGender gender) => gender == WowGender.Female ? IconFemale : IconMale;
    }
}
