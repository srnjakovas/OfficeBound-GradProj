using Hangfire;
using Hangfire.SqlServer;
using OfficeBound.Application;
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

var connectionString = builder.Configuration.GetConnectionString("DbConnectionString");
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(connectionString, new SqlServerStorageOptions
    {
        CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
        SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
        QueuePollInterval = TimeSpan.Zero,
        UseRecommendedIsolationLevel = true,
        DisableGlobalLocks = true
    }));

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

RecurringJob.AddOrUpdate<MarkRequestsAsExpiredJob>(
    nameof(MarkRequestsAsExpiredJob),
    job => job.MarkRequestsAsExpiredAsync(),
    Cron.Daily(23, 0), // 11 PM daily
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.Local
    });

app.Run();