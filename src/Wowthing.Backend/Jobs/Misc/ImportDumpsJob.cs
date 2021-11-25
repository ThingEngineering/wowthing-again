using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Utilities;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Misc
{
    public class ImportDumpsJob : JobBase, IScheduledJob
    {
        private JankTimer _timer;

        private Language[] _languages =
        {
            Language.deDE,
            Language.esES,
            Language.esMX,
            Language.frFR,
            Language.itIT,
            //Language.koKR,
            Language.ptBR,
            Language.ruRU,
            //Language.zhCN,
            //Language.zhTW,
        };

        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.ImportDumps,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(24),
            Version = 1,
        };

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();

            await ImportItems();
            await ImportMounts();
            await ImportPets();
            await ImportToys();
            
            await Context.SaveChangesAsync();
            _timer.AddPoint("Save", true);
            
            Logger.Information("{Timing}", _timer.ToString());
        }

        private async Task ImportItems()
        {
            var items = await DataUtilities.LoadDumpCsvAsync<DumpItem>("item");
            
            var baseItemSparseMap = (await DataUtilities.LoadDumpCsvAsync<DumpItemSparse>(Path.Join("enUS", "itemsparse")))
                .ToDictionary(itemsparse => itemsparse.ID);

            var dbItemMap = await Context.WowItem.ToDictionaryAsync(item => item.Id);
            
            var dbLanguageMap = await Context.LanguageString
                .Where(ls => ls.Type == StringType.WowItemName)
                .ToDictionaryAsync(ls => (ls.Language, ls.Id));

            _timer.AddPoint("Items:Load");

            foreach (var item in items)
            {
                if (!baseItemSparseMap.TryGetValue(item.ID, out var itemSparse))
                {
                    //Logger.Debug("Item with no matching ItemSparse: {Id}", item.ID);
                    continue;
                }

                if (!dbItemMap.TryGetValue(item.ID, out var dbItem))
                {
                    dbItem = new WowItem
                    {
                        Id = item.ID,
                    };
                    Context.WowItem.Add(dbItem);
                }

                dbItem.ClassId = item.ClassID;
                dbItem.SubclassId = item.SubclassID;
                dbItem.InventoryType = item.InventoryType;

                dbItem.ClassMask = itemSparse.AllowableClass;
                dbItem.ContainerSlots = itemSparse.ContainerSlots;
                dbItem.RaceMask = itemSparse.AllowableRace;
                dbItem.Stackable = itemSparse.Stackable;

                if (!dbLanguageMap.TryGetValue((Language.enUS, item.ID), out var languageString))
                {
                    languageString = new LanguageString
                    {
                        Language = Language.enUS,
                        Type = StringType.WowItemName,
                        Id = item.ID,
                    };
                    Context.LanguageString.Add(languageString);
                }

                languageString.String = itemSparse.Name;
            }

            foreach (var language in _languages)
            {
                var languageItemSparses = await DataUtilities.LoadDumpCsvAsync<DumpItemSparse>(Path.Join(language.ToString(), "itemsparse"), skipValidation: true);
                foreach (var itemSparse in languageItemSparses)
                {
                    if (!dbLanguageMap.TryGetValue((language, itemSparse.ID), out var languageString))
                    {
                        languageString = new LanguageString
                        {
                            Language = language,
                            Type = StringType.WowItemName,
                            Id = itemSparse.ID,
                        };
                        Context.LanguageString.Add(languageString);
                    }

                    languageString.String = itemSparse.Name;
                }
            }
            
            _timer.AddPoint("Items:Process");
        }

        private async Task ImportMounts()
        {
            var baseMounts = await DataUtilities.LoadDumpCsvAsync<DumpMount>(Path.Join("enUS", "mount"));

            var dbMountMap = await Context.WowMount
                .ToDictionaryAsync(mount => mount.Id);

            var dbLanguageMap = await Context.LanguageString
                .Where(ls => ls.Type == StringType.WowMountName)
                .ToDictionaryAsync(ls => (ls.Language, ls.Id));

            _timer.AddPoint("Mounts:Load");
            
            foreach (var mount in baseMounts)
            {
                if (!dbMountMap.TryGetValue(mount.ID, out var dbMount))
                {
                    dbMount = new WowMount
                    {
                        Id = mount.ID,
                    };
                    Context.WowMount.Add(dbMount);
                }

                dbMount.SpellId = mount.SourceSpellID;
                dbMount.Flags = mount.Flags;
                dbMount.SourceType = mount.SourceTypeEnum;

                if (!dbLanguageMap.TryGetValue((Language.enUS, mount.ID), out var languageString))
                {
                    languageString = new LanguageString
                    {
                        Language = Language.enUS,
                        Type = StringType.WowMountName,
                        Id = mount.ID,
                    };
                    Context.LanguageString.Add(languageString);
                }

                languageString.String = mount.Name;
            }

            foreach (var language in _languages)
            {
                var languageMounts = await DataUtilities.LoadDumpCsvAsync<DumpMount>(Path.Join(language.ToString(), "mount"), skipValidation: true);
                foreach (var mount in languageMounts)
                {
                    if (!dbLanguageMap.TryGetValue((language, mount.ID), out var languageString))
                    {
                        languageString = new LanguageString
                        {
                            Language = language,
                            Type = StringType.WowMountName,
                            Id = mount.ID,
                        };
                        Context.LanguageString.Add(languageString);
                    }

                    languageString.String = mount.Name;
                }
            }

            _timer.AddPoint("Mounts:Process");
        }

        private async Task ImportPets()
        {
            var pets = await DataUtilities.LoadDumpCsvAsync<DumpBattlePetSpecies>("battlepetspecies");

            var dbPetMap = await Context.WowPet
                .ToDictionaryAsync(pet => pet.Id);

            _timer.AddPoint("Pets:Load");

            foreach (var pet in pets)
            {
                if (!dbPetMap.TryGetValue(pet.ID, out var dbPet))
                {
                    dbPet = new WowPet
                    {
                        Id = pet.ID,
                    };
                    Context.WowPet.Add(dbPet);
                }

                dbPet.CreatureId = pet.CreatureID;
                dbPet.SpellId = pet.SummonSpellID;
                dbPet.Flags = pet.Flags;
                dbPet.PetType = pet.PetTypeEnum;
                dbPet.SourceType = pet.SourceTypeEnum;
            }
            
            _timer.AddPoint("Pets:Process");
        }

        private async Task ImportToys()
        {
            var toys = await DataUtilities.LoadDumpCsvAsync<DumpToy>("toy");

            var dbToyMap = await Context.WowToy
                .ToDictionaryAsync(toy => toy.Id);

            _timer.AddPoint("Toys:Load");

            foreach (var toy in toys)
            {
                if (!dbToyMap.TryGetValue(toy.ID, out var dbToy))
                {
                    dbToy = new WowToy
                    {
                        Id = toy.ID,
                    };
                    Context.WowToy.Add(dbToy);
                }

                dbToy.ItemId = toy.ItemID;
                dbToy.Flags = toy.Flags;
                dbToy.SourceType = toy.SourceTypeEnum;
            }
            
            _timer.AddPoint("Toys:Process");
        }
    }
}
