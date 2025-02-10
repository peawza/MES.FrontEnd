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


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.WithOrigins("http://localhost:5137") // Explicitly allow frontend origin
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Use only if credentials (cookies, auth headers) are required
        });
});
// Add services to the container.

builder.Services.AddControllersWithViews(options =>
{
    options.ModelBinderProviders.Insert(0, new DateTimeModelBinderProvider());
})
.AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver())
.AddRazorRuntimeCompilation();
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddMemoryCache();
builder.Services.AddKendo();



builder.Services.AddScoped<ISiteMapProvider, DbSiteMapProvider>();



builder.Services.AddHttpClient();
builder.Services.AddSingleton<DbMessageLocalizer>();
builder.Services.AddSingleton<DbMessageResources>();
builder.Services.AddSingleton<IMessageLocalizer, DbMessageLocalizer>();
builder.Services.AddSingleton<IMessageResources, DbMessageResources>();










var app = builder.Build();


app.UseCors("AllowAll");
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


app.UseCors("AllowAll");
app.UseRouting();

app.UseAuthorization();




using (var scope = app.Services.CreateScope())
{
    var serviceMessage = scope.ServiceProvider.GetRequiredService<DbMessageLocalizer>();
    await serviceMessage.LoadResourceMessagesAsync(); // Fetch data only once


    var serviceResources = scope.ServiceProvider.GetRequiredService<DbMessageResources>();

    await serviceResources.LoadResourceMessagesAsync(); // Fetch data only once



}
IServiceProvider services = builder.Services.BuildServiceProvider();
Resources resources = new Resources(environment, configuration, services);
resources.update_Resources_JS();




app.MapControllerRoute(
    name: "MyArea",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


await app.RunAsync();
