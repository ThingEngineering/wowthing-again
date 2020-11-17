using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Wowthing.Backend.Extensions
{
    public static class HttpResponseMessageExtensions
    {
        public static async Task<T> DeserializeJsonAsync<T>(this HttpResponseMessage response)
        {
            var contentStream = await response.Content.ReadAsStreamAsync();
            return await JsonSerializer.DeserializeAsync<T>(contentStream, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            });
        }
    }
}
