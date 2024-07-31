using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Web.Forms;
using Wowthing.Web.Models.Search;

namespace Wowthing.Web.Controllers.API;

public class ItemSearchController : Controller
{
    private readonly ILogger<ItemSearchController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly WowDbContext _context;

    public ItemSearchController(
        ILogger<ItemSearchController> logger,
        UserManager<ApplicationUser> userManager,
        WowDbContext context
        )
    {
        _logger = logger;
        _userManager = userManager;
        _context = context;
    }

    [HttpPost("api/item-search")]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ItemSearch([FromBody] ApiItemSearchForm form)
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null)
        {
            return NotFound();
        }

        var parts = form.Terms.Split(' ', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0)
        {
            return BadRequest();
        }

        var stringQuery = _context.LanguageString
            .Where(ls => ls.Language == user.Settings.General.Language && ls.Type == StringType.WowItemName);
        foreach (string part in parts)
        {
            // Alias to avoid variable capture bullshit
            string temp = part;
            stringQuery = stringQuery.Where(item => EF.Functions.ILike(item.String, $"%{temp}%"));
        }

        var items = await stringQuery
            .Select(ls => new { ls.Id, ls.String })
            .Distinct()
            //.Take(100)
            .ToArrayAsync();

        if (items.Length == 0)
        {
            return Json(Array.Empty<string>());
        }

        var itemIds = items
            .Select(item => item.Id)
            .ToArray();
        var itemMap = items.ToDictionary(item => item.Id, item => item.String);

        var characterTemp = await _context.PlayerCharacter
            .Where(pc => pc.Account.UserId == user.Id)
            .Select(pc => new { pc.Id, pc.GuildId })
            .ToArrayAsync();

        var characterIds = characterTemp
            .Select(t => t.Id)
            .ToArray();

        var guildIds = characterTemp
            .Where(t => t.GuildId.HasValue)
            .Select(t => t.GuildId.Value)
            .ToArray();

        // Character items
        var characterItems = await _context.PlayerCharacterItem
            .Where(pci => characterIds.Contains(pci.CharacterId))
            .Where(pci => itemIds.Contains(pci.ItemId))
            .ToArrayAsync();

        var characterGrouped = characterItems
            .ToGroupedDictionary(pci => pci.ItemId);

        // Character equipped
        var equippedItems = await _context.PlayerCharacterEquippedItems
            .Where(pcei => characterIds.Contains(pcei.CharacterId))
            .ToArrayAsync();

        var equippedGrouped = new Dictionary<int, List<(int CharacterId, PlayerCharacterEquippedItem EquippedItem)>>();
        foreach (var pcei in equippedItems)
        {
            foreach (var equippedItem in pcei.Items.Values)
            {
                if (itemMap.ContainsKey(equippedItem.ItemId))
                {
                    if (!equippedGrouped.ContainsKey(equippedItem.ItemId))
                    {
                        equippedGrouped[equippedItem.ItemId] = new();
                    }

                    equippedGrouped[equippedItem.ItemId].Add((pcei.CharacterId, equippedItem));
                }
            }
        }

        // Guild items
        var guildItems = await _context.PlayerGuildItem
            .Where(pgi => guildIds.Contains(pgi.GuildId))
            .Where(pgi => itemIds.Contains(pgi.ItemId))
            .ToArrayAsync();

        var guildGrouped = guildItems
            .ToGroupedDictionary(pgi => pgi.ItemId);

        var foundItemIds = characterGrouped.Keys
            .Union(equippedGrouped.Keys)
            .Union(guildGrouped.Keys)
            .Distinct()
            .OrderBy(id => id)
            .ToArray();

        var results = new List<ItemSearchResponseItem>();
        foreach (int itemId in foundItemIds)
        {
            var item = new ItemSearchResponseItem
            {
                ItemId = itemId,
                ItemName = itemMap[itemId],
            };

            if (characterGrouped.TryGetValue(itemId, out var characterResults))
            {
                item.Characters = characterResults.Select(result => new ItemSearchResponseCharacter
                {
                    CharacterId = result.CharacterId,
                    Count = result.Count,
                    Location = result.Location,
                    ItemLevel = result.ItemLevel,
                    Quality = result.Quality,
                    Context = result.Context,
                    EnchantId = result.EnchantId,
                    SuffixId = result.SuffixId,
                    BonusIds = result.BonusIds,
                    Gems = result.Gems,
                }).ToList();
            }

            if (equippedGrouped.TryGetValue(itemId, out var equippedResults))
            {
                item.Equipped = equippedResults.Select(result => new ItemSearchResponseCharacter
                {
                    CharacterId = result.CharacterId,
                    Count = 1,
                    Location = ItemLocation.Equipped,
                    ItemLevel = (short)result.EquippedItem.ItemLevel,
                    Quality = (short)result.EquippedItem.Quality,
                    Context = (short)result.EquippedItem.Context,
                    EnchantId = (short)result.EquippedItem.EnchantmentIds.FirstOrDefault(),
                    SuffixId = 0, // TODO why no suffix
                    BonusIds = result.EquippedItem.BonusIds.Select(b => (short)b).ToList(),
                    Gems = result.EquippedItem.GemIds
                }).ToList();
            }

            if (guildGrouped.TryGetValue(itemId, out var guildResults))
            {
                item.GuildBanks = guildResults.Select(result => new ItemSearchResponseGuildBank
                {
                    GuildId = result.GuildId,
                    Tab = result.ContainerId,
                    Slot = result.Slot,
                    Count = result.Count,
                    ItemLevel = result.ItemLevel,
                    Quality = result.Quality,
                    Context = result.Context > 0 ? result.Context : null,
                    EnchantId = result.EnchantId > 0 ? result.EnchantId : null,
                    SuffixId = result.SuffixId > 0 ? result.SuffixId : null,
                    BonusIds = result.BonusIds,
                    Gems = result.Gems,
                }).ToList();
            }

            results.Add(item);
        }

        return Json(results.OrderBy(result => result.ItemName));
    }
}
