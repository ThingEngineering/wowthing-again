﻿using System.Net.Http;

namespace Wowthing.Backend.Extensions
{
    public static class HttpResponseMessageExtensions
    {
        public static async Task<T> DeserializeJsonAsync<T>(this HttpResponseMessage response)
        {
            var contentString = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(contentString);
        }
    }
}
