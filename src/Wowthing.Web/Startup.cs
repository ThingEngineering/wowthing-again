using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Wowthing.Lib.Database.Contexts;
using Wowthing.Lib.Database.Models;
using Wowthing.Lib.Extensions;
using Wowthing.Web.Extensions;

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
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
            });

            services.AddControllersWithViews();

            services.AddPostgres(Configuration.GetConnectionString("Postgres"));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<WowDbContext>();

            services.AddAuthentication()
                .AddCookie(options =>
                {
                    options.LoginPath = "/login";
                    options.LogoutPath = "/logout";
                })
                .AddBattleNet(options =>
                {
                    options.ClientId = Configuration["BattleNet:ClientID"];
                    options.ClientSecret = Configuration["BattleNet:ClientSecret"];
                    options.SaveTokens = true;
                    options.Scope.Add("wow.profile");
                });

            // Redis
            var redis = services.AddRedis(Configuration.GetConnectionString("Redis"));
            services.AddDataProtection()
                .PersistKeysToStackExchangeRedis(redis);

            // Forwarded headers in production
            if (Env.IsProduction())
            {
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    options.ForwardedForHeaderName = "CF-Connecting-IP";
                });
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            //app.UseCookiePolicy();

            if (Env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseStaticFiles();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseForwardedHeaders();
                app.UseStaticFilesWithCaching();
            }

            app.UseResponseCompression();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
