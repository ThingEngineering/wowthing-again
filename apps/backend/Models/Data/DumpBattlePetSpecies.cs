// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data
{
    public class DumpBattlePetSpecies
    {
        public int ID { get; set; }
        public int CreatureID { get; set; }
        public int Flags { get; set; }
        public int SummonSpellID { get; set; }
        public short PetTypeEnum { get; set; }
        public short SourceTypeEnum { get; set; }
    }
}
