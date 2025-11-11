using Hangfire;
using Hangfire.SqlServer;
using OfficeBound.Application;
using OfficeBound.Application.Configuration;
using OfficeBound.Infrastructure;
using OfficeBound.Presentation;
using OfficeBound.Presentation.Handlers;
using OfficeBound.Presentation.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policyBuilder =>
        {
            policyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5174", "http://localhost:5173");
        }
    );
});

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddExceptionHandler<ExceptionHandler>();

builder.Services.Configure<OfficeResourcesConfiguration>(
    builder.Configuration.GetSection("OfficeResources"));

var connectionString = builder.Configuration.GetConnectionString("DbConnectionString");
var hangfireConnectionString = builder.Configuration.GetConnectionString("HangfireConnectionString");

builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(hangfireConnectionString));

builder.Services.AddHangfireServer();

builder.Services.AddScoped<MarkRequestsAsExpiredJob>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(_ => { });
app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.UseAuthorization();

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() }
});

app.MapControllers();

// This operation must be executed out of Working hours
RecurringJob.AddOrUpdate<MarkRequestsAsExpiredJob>(
    nameof(MarkRequestsAsExpiredJob),
    job => job.MarkRequestsAsExpiredAsync(),
    Cron.Daily(23, 0),
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.Local
    });

app.Run();