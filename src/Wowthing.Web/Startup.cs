using System.Net;
using Anemonis.AspNetCore.RequestDecompression;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Extensions;
using Wowthing.Web.Extensions;
using Wowthing.Web.Misc;
using Wowthing.Web.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Wowthing.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCaching();

            services.AddRequestDecompression(options =>
            {
                options.Providers.Add<DeflateDecompressionProvider>();
                options.Providers.Add<GzipDecompressionProvider>();
                options.Providers.Add<BrotliDecompressionProvider>();
            });
            
            services.AddControllersWithViews()
                .AddNewtonsoftJson();

            services.AddRouting(options =>
            {
                // NOTE these did use .Add() but https://youtrack.jetbrains.com/issue/RSRP-484029
                options.ConstraintMap["slug"] = typeof(SlugRouteConstraint);
                options.ConstraintMap["username"] = typeof(UsernameRouteConstraint);
            });

            services.AddPostgres(Configuration.GetConnectionString("Postgres"));

            services.AddIdentity<ApplicationUser, IdentityRole<long>>()
                .AddEntityFrameworkStores<WowDbContext>();

            services.AddAuthentication()
                .AddBattleNet(options =>
                {
                    options.ClientId = Configuration["BattleNet:ClientID"];
                    options.ClientSecret = Configuration["BattleNet:ClientSecret"];
                    options.SaveTokens = true;
                    options.Scope.Add("wow.profile");
                });

            services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = "/auth/login";
                options.LogoutPath = "/auth/logout";
            });

            // Redis
            var redis = services.AddRedis(Configuration.GetConnectionString("Redis"));
            services.AddDataProtection()
                .PersistKeysToStackExchangeRedis(redis);


            if (Env.IsDevelopment())
            {
                services.AddResponseCompression(options =>
                {
                    options.EnableForHttps = true;
                });
            }

            // Forwarded headers in production
            if (Env.IsProduction())
            {
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                    options.KnownNetworks.Add(new IPNetwork(IPAddress.Parse("10.0.0.0"), 8));
                    options.KnownNetworks.Add(new IPNetwork(IPAddress.Parse("172.16.0.0"), 12));
                    options.KnownNetworks.Add(new IPNetwork(IPAddress.Parse("192.168.0.0"), 16));
                    //options.ForwardedForHeaderName = "CF-Connecting-IP";
                });
            }

            // Our services
            services.AddScoped<UploadService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, WowDbContext dbContext)
        {
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy(),
                },
                DateTimeZoneHandling = DateTimeZoneHandling.RoundtripKind,
            };

            dbContext.Database.Migrate();

            if (Env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseResponseCompression();
                app.UseStaticFiles();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseForwardedHeaders();
                app.UseStaticFilesWithCaching();
            }

            app.UseStatusCodePagesWithReExecute("/error", "?statusCode={0}");

            app.UseRouting();

            // TODO CORS

            app.UseResponseCaching();
            app.UseRequestDecompression();
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
