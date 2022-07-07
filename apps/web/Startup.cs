using Anemonis.AspNetCore.RequestDecompression;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Web.Misc;
using Wowthing.Web.Services;
using Newtonsoft.Json.Serialization;
using Wowthing.Lib.Services;
using Wowthing.Web.Models;

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
            // Our configs
            var wowthingWebConfig = Configuration.GetSection("WowthingWeb");
            var wowthingWebOptions = new WowthingWebOptions();
            wowthingWebConfig.Bind(wowthingWebOptions);

            services.Configure<WowthingWebOptions>(wowthingWebConfig);

            services.AddResponseCaching();

            services.AddRequestDecompression(options =>
            {
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

            // Auth
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
                // Can't do this in dev as 'localhost' is a special case
                if (Env.IsProduction())
                {
                    options.Cookie.Domain = $".{wowthingWebOptions.Hostname}";
                }

                options.LoginPath = "/auth/login";
                options.LogoutPath = "/auth/logout";
            });

            // Anti-forgery
            services.AddAntiforgery(options =>
            {
                // Can't do this in dev as 'localhost' is a special case
                if (Env.IsProduction())
                {
                    options.Cookie.Domain = $".{wowthingWebOptions.Hostname}";
                }
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

            // Ugh, CORS
            services.AddCors(options =>
            {
                options.AddPolicy("WowthingCorsPolicy",
                    builder => builder
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .WithOrigins($"https://*.{wowthingWebOptions.Hostname}")
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .AllowAnyHeader()
                        .Build()
                );
            });
            
            // Our services
            services.AddScoped<CacheService>();
            services.AddScoped<UploadService>();
            services.AddScoped<UriService>();
            services.AddScoped<UserService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider, WowDbContext dbContext)
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

            app.UseCors("WowthingCorsPolicy");

            app.UseResponseCaching();
            app.UseRequestDecompression();
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            
            CreateRoles(serviceProvider).Wait();
        }

        private static readonly string[] Roles =
        {
            "Admin",
            "Donor",
            "Trusted",
        };
        private async Task CreateRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<long>>>();

            foreach (var roleName in Roles)
            {
                var exists = await roleManager.RoleExistsAsync(roleName);
                if (!exists)
                {
                    await roleManager.CreateAsync(new IdentityRole<long>(roleName));
                }
            }
        }
    }
}
