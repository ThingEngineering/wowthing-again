using Wowthing.Lib.Models.Player;
using Wowthing.Web.Models.Api.User;

namespace Wowthing.Web.Converters;

public class ApiUserCharacterWeeklyConverter : JsonConverter<ApiUserCharacterWeekly>
{
    public override ApiUserCharacterWeekly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ApiUserCharacterWeekly weekly, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(weekly.DelveWeek);
        writer.WriteNumberArray(weekly.DelveLevels);
        writer.WriteStringArray(weekly.DelveMaps);

        JsonSerializer.Serialize(writer, weekly.KeystoneScannedAt, options);

        writer.WriteNumberValue(weekly.KeystoneDungeon);
        writer.WriteNumberValue(weekly.KeystoneLevel);

        if (weekly.Vault != null)
        {
            JsonSerializer.Serialize(writer, weekly.Vault.ScannedAt, options);
            writer.WriteBooleanValue(weekly.Vault.AvailableRewards);
            writer.WriteBooleanValue(weekly.Vault.GeneratedRewards);

            WriteVaultProgress(writer, weekly.Vault.MythicPlusProgress, options);
            WriteVaultProgress(writer, weekly.Vault.RaidProgress, options);
            WriteVaultProgress(writer, weekly.Vault.WorldProgress, options);
        }

        writer.WriteEndArray();
    }

    private void WriteVaultProgress(
        Utf8JsonWriter writer,
        List<PlayerCharacterWeeklyVaultProgress> vaultProgresses,
        JsonSerializerOptions options
    )
    {
        if (vaultProgresses == null)
        {
            writer.WriteNullValue();
            return;
        }

        writer.WriteStartArray();

        foreach (var vaultProgress in vaultProgresses)
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(vaultProgress.Level);
            writer.WriteNumberValue(vaultProgress.Tier);
            writer.WriteNumberValue(vaultProgress.Progress);
            writer.WriteNumberValue(vaultProgress.Threshold);

            writer.WriteStartArray();
            foreach (var reward in vaultProgress.Rewards.EmptyIfNull())
            {
                JsonSerializer.Serialize(writer, reward, options);
            }
            writer.WriteEndArray();

            writer.WriteEndArray();
        }

        writer.WriteEndArray();
    }
}
