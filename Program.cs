using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;
using WEB.APP.Extensions;
using WEB.APP.Localization;
using WEB.APP.MvcWebApp.Navigation;

var builder = WebApplication.CreateBuilder(args);
IConfiguration configuration = builder.Configuration; // allows both to access and to set up the config
IWebHostEnvironment environment = builder.Environment;
ConfigureWebHostBuilder WebHost = builder.WebHost;


// Add services to the container.

builder.Services.AddControllersWithViews(options =>
{
    options.ModelBinderProviders.Insert(0, new DateTimeModelBinderProvider());
})
.AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver())
.AddRazorRuntimeCompilation();
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddMemoryCache();



builder.Services.AddScoped<ISiteMapProvider, DbSiteMapProvider>();



builder.Services.AddHttpClient();
builder.Services.AddSingleton<DbMessageLocalizer>();
builder.Services.AddSingleton<IMessageLocalizer, DbMessageLocalizer>();













var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


#region Set up Time Zone
var supportedCultures = new[] { "en" };

var cultureOptions = ((IApplicationBuilder)app).ApplicationServices.GetRequiredService<IOptions<ApplicationCultureOptions>>();


var localizationOptions = new RequestLocalizationOptions()
{
    SupportedUICultures = cultureOptions.Value.GetCultures(supportedCultures),
    SupportedCultures = cultureOptions.Value.GetCultures("en")
}.SetDefaultCulture("en");
app.UseRequestLocalization(localizationOptions);
#endregion


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();



using (var scope = app.Services.CreateScope())
{
    var service = scope.ServiceProvider.GetRequiredService<DbMessageLocalizer>();
    await service.LoadResourceMessagesAsync(); // Fetch data only once
}


app.MapControllerRoute(
    name: "MyArea",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


await app.RunAsync();
