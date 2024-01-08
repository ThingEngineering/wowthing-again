using Wowthing.Lib.Models.Player;
using Wowthing.Web.Converters;

namespace Wowthing.Web.Models.Api.User;

[JsonConverter(typeof(ApiUserCharacterCurrencyConverter))]
public class ApiUserCharacterCurrency : PlayerCharacterAddonDataCurrency
{
    public ApiUserCharacterCurrency(PlayerCharacterAddonDataCurrency pcadc)
    {
        Quantity = pcadc.Quantity;
        Max = pcadc.Max;
        WeekQuantity = pcadc.WeekQuantity;
        WeekMax = pcadc.WeekMax;
        TotalQuantity = pcadc.TotalQuantity;
        CurrencyId = pcadc.CurrencyId;
        IsWeekly = pcadc.IsWeekly;
        IsMovingMax = pcadc.IsMovingMax;
    }
}
