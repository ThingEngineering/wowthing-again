using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using Wowthing.Web.Models;

namespace Wowthing.Web.Extensions;

public static class IServiceCollectionExtensions
{
    public static IServiceCollection AddManifest(this IServiceCollection services,
        JsonSerializerOptions jsonSerializerOptions)
    {
        var manifest = new FrontendManifest();

        string manifestFilename = Path.Join(".", "wwwroot", "dist", "manifest.json");
        if (File.Exists(manifestFilename))
        {
            string json = File.ReadAllText(manifestFilename);
            var entries = JsonSerializer.Deserialize<Dictionary<string, FrontendManifestJson>>(
                json, jsonSerializerOptions);
            foreach (var entry in entries.Values.Where(e => e.IsEntry))
            {
                var entrypoint = manifest.Entrypoints[entry.Src] = new();
                RecursivelyAddCssAndJs(entries, entrypoint, entry);
            }
        }

        foreach (var (key, value) in manifest.Entrypoints)
        {
            Console.WriteLine($"{key} => {JsonSerializer.Serialize(value.Css)} {JsonSerializer.Serialize(value.Js)}");
        }

        services.AddSingleton(manifest);

        return services;
    }

    private static void RecursivelyAddCssAndJs(
        Dictionary<string, FrontendManifestJson> entries,
        FrontendManifestEntrypoint entrypoint,
        FrontendManifestJson entry
    )
    {
        foreach (string cssFile in entry.Css.EmptyIfNull())
        {
            if (!entrypoint.Css.Contains(cssFile))
            {
                entrypoint.Css.Insert(0, cssFile);
            }
        }

        if (!entrypoint.Js.Contains(entry.File))
        {
            entrypoint.Js.Insert(0, entry.File);
        }

        foreach (string importName in entry.Imports.EmptyIfNull())
        {
            RecursivelyAddCssAndJs(entries, entrypoint, entries[importName]);
        }
    }
}
