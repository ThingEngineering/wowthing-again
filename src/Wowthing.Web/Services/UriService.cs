﻿using System;
using System.Security.Policy;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Options;
using Wowthing.Lib.Models;
using Wowthing.Web.Models;

namespace Wowthing.Web.Services
{
    public class UriService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly LinkGenerator _linkGenerator;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WowthingWebOptions _webOptions;

        public UriService(
            IHttpContextAccessor httpContextAccessor,
            IOptions<WowthingWebOptions> webOptions,
            LinkGenerator linkGenerator,
            UserManager<ApplicationUser> userManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _linkGenerator = linkGenerator;
            _userManager = userManager;
            _webOptions = webOptions.Value;
        }

        private Uri _baseUri;
        public Uri BaseUri
        {
            get
            {
                if (_baseUri == null)
                {
                    var host = _httpContextAccessor.HttpContext.Request.Host.Host;
                    var builder = new UriBuilder();

                    // localhost is a special case due to cookies
                    if (host.EndsWith("localhost"))
                    {
                        builder.Host = host;
                        builder.Port = _httpContextAccessor.HttpContext.Request.Host.Port.GetValueOrDefault();
                    }
                    else
                    {
                        var hostParts = _webOptions.Hostname.Split(':');
                        builder.Host = hostParts[0];
                        if (hostParts.Length == 2)
                        {
                            builder.Port = int.Parse(hostParts[1]);
                        }
                    }

                    builder.Scheme = _httpContextAccessor.HttpContext.Request.Scheme;

                    _baseUri = builder.Uri;
                }

                return _baseUri;
            }
        }

        public async Task<string> GetUriForUser()
        {
            var username = _httpContextAccessor?.HttpContext?.User?.Identity?.Name;
            var user = await _userManager.FindByNameAsync(username);

            if (user.CanUseSubdomain)
            {
                var builder = new UriBuilder(BaseUri);
                if (!builder.Host.StartsWith($"{username}."))
                {
                    builder.Host = $"{username}.{builder.Host}";
                }
                return builder.Uri.ToString();
            }
            else
            {
                return _linkGenerator.GetUriByAction(
                    httpContext: _httpContextAccessor.HttpContext,
                    controller: "User",
                    action: "Index",
                    values: new
                    {
                        username = username,
                    }
                );
            }
        }
    }
}
